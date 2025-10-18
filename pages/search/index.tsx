import GoogleMapReact from 'google-map-react'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getToken } from 'next-auth/jwt'
import { useCallback, useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'

import { CurrentPositionMarker } from '@/components/common/CurrentPositionMarker'
import { MainHeader } from '@/components/header/MainHeader'
import { defaultCenter, standardMapOptions } from '@/components/Map/mapOptions'
import { API_SEARCH } from '@/core/consts/apiLinks'
import { locationDefaultHeaders, SEARCH_LIMIT } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { debounceFunction } from '@/core/helpers/debounceFunction'
import {
  getServerSideUrl,
  getUrlWithSearchParams,
} from '@/core/helpers/getUrlWithSearchParams'
import { IProInfo } from '@/features/profile/profileType'
import { searchFilterKeys } from '@/features/search/helpers/consts'
import { getBoundsFromBox } from '@/features/search/helpers/getBoundsFromBox'
import { getBoxFromBounds } from '@/features/search/helpers/getBoxFromBounds'
import { getSearchPageTitle } from '@/features/search/helpers/getSearchPageTitle'
import { isInBounds } from '@/features/search/helpers/isInBounds'
import { defaultLocation } from '@/features/search/helpers/localLocation'
import { useSearchStore } from '@/features/search/hooks/useSearchStore'
import MapMarker from '@/features/search/MapMarker'
import MobileMapMarker from '@/features/search/mobile/MobileMapMarker'
import SearchMobileBottomSheet from '@/features/search/mobile/SearchMobileBottomSheet'
import SearchResultsSlider from '@/features/search/mobile/SearchResultsSlider'
import { NewMobileSearchInput } from '@/features/search/NewSerachInput/NewMobileSearchInput'
import SearchMapControls from '@/features/search/SearchMapControls'
import SearchResultsSection from '@/features/search/SearchResultsSection'
import { useCurrentPosition } from '@/hooks/useCurrentPosition'
import { useIsRendered } from '@/hooks/useIsRendered'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { useRedirectProToUserPage } from '@/hooks/useRedirectProToUserPage'
import BaseLayout from '@/layouts/BaseLayout'
import { instance, universalInstance } from '@/store/instance'
import { IResponseData, SearchErrorProps } from '@/types/common'

const SearchError = dynamic<SearchErrorProps>(() =>
  import('@/features/search/SearchError').then((m) => m.SearchError)
)

interface Props {
  results: IResponseData<IProInfo>
  error?: string
}

const SearchPage: NextPage<Props> = ({ results, error }) => {
  const router = useRouter()

  useRedirectProToUserPage()
  const refContainer = useRef<HTMLDivElement | null>(null)
  const [isGridView, setIsGridView] = useState(false)

  const [initialResults, setInitialResults] =
    useState<IResponseData<IProInfo>>(results)
  const [mapResults, setMapResults] = useState<IResponseData<IProInfo>>(results)
  const [resState, setResState] = useState<IResponseData<IProInfo>>(results)
  const isMapUpdate = useRef(false)

  const { currentPosition } = useCurrentPosition()
  useEffect(() => {
    if (!isMapUpdate.current) {
      // Only update initial results if it's not from a map update
      setInitialResults(results)
    }
    setMapResults(results)
    setResState(isGridView ? initialResults : results)
    setPage(1)
    // Reset the flag after handling the results
    isMapUpdate.current = false
  }, [results, isGridView])

  const [page, setPage] = useState(1)
  const [isFetchng, setIsFenching] = useState(false)

  const scrollHandler = useCallback(() => {
    if (
      (refContainer.current?.scrollHeight || 0) -
        ((refContainer.current?.scrollTop || 0) + window.innerHeight) <
      100
    ) {
      setIsFenching(true)
    }
  }, [refContainer])

  useEffect(() => {
    if (isFetchng && resState?.data?.length < results?.total) {
      const headers: any = {}
      const lat = router.query.lat as string
      const lng = router.query.lng as string
      if (lat && lng) {
        headers[locationDefaultHeaders.lng] = lng
        headers[locationDefaultHeaders.lat] = lat
      }

      instance
        .get(
          getUrlWithSearchParams(API_SEARCH.searchV2, {
            ...router.query,
            box: router.query.box,
            page: page + 1,
            limit: SEARCH_LIMIT,
            // to identify that the request is from web
            source: 'web',
            filter: [],
          }),
          { headers }
        )
        .then((e) => {
          setResState((prev) => ({
            ...prev,
            data: [...prev.data, ...(e.data?.data || [])],
          }))
        })
        .finally(() => {
          setIsFenching(false)
          setPage((prev) => prev + 1)
        })
    }
  }, [isFetchng, page, resState?.data.length, results?.total, router.query])

  useEffect(() => {
    if (refContainer.current) {
      refContainer.current?.addEventListener('scroll', scrollHandler)
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      refContainer.current?.removeEventListener('scroll', scrollHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refContainer.current, scrollHandler])

  const query = router.query
  const qBounds = query?.box as string
  const isRendered = useIsRendered()
  const [mobileActivePro, setMobileActivePro] = useState<null | number>(null)
  const { isTablet, isSmall } = useMediaScreen()
  const { loading, setLoading, map, setMap, canFetch } = useSearchStore()
  const slickRef = useRef<Slider>(null)

  useEffect(() => {
    if (!map) {
      return
    }

    const box = qBounds?.split(',').map((bound) => Number(bound))
    if (box?.length === 4 && map && !canFetch.current) {
      const bounds = getBoundsFromBox(box)
      map.fitBounds(bounds, 0)
    }

    //eslint-disable-next-line
  }, [qBounds, map])

  const firstRequest = useRef(true)
  const mapFunc = async () => {
    if (map) {
      if (!canFetch.current) {
        canFetch.current = true
        return
      }

      const bounds = map.getBounds()
      const center = map.getCenter()
      if (bounds && center) {
        const box = getBoxFromBounds(bounds)
        const zoom = map.getZoom()

        // Reset to minimum zoom if zoomed in too far
        if (zoom && zoom > 14) {
          map.setZoom(4)
          return
        }

        const _center: any = {}

        if (currentPosition) {
          const isInsideBounds = isInBounds(currentPosition, bounds)
          if (isInsideBounds) {
            _center.lat = currentPosition.lat
            _center.lng = currentPosition.lng
          } else {
            _center.lat = center.lat()
            _center.lng = center.lng()
          }
        } else {
          _center.lat = center.lat()
          _center.lng = center.lng()
        }

        setLoading(true)
        const extendBox = query?.extendBox as string
        const params = query
        if (extendBox) {
          delete params.extendBox
        }
        if (!firstRequest.current) {
          // Set the flag before making the map-triggered request
          isMapUpdate.current = true
          await router.replace({
            pathname: ROUTES.search,
            query: {
              ...params,
              lat: _center.lat,
              lng: _center.lng,
              box: box.join(','),
              zoom: zoom,
            },
          })
          setLoading(false)
        } else {
          firstRequest.current = false
          setLoading(false)
        }
      }
    }
  }

  const fitMap = debounceFunction(mapFunc, 300)

  const afterSliderChange = (e: number) => {
    const pro = results?.data[e]
    if (pro) {
      setMobileActivePro(e)
      if (pro && pro.latitude && pro.longitude) {
        canFetch.current = false
        map?.setCenter({
          lat: pro.latitude,
          lng: pro.longitude,
        })
      }
    }
  }

  const toggleGridView = (s: boolean) => {
    setIsGridView(s)
    // Switch between initial and map results based on view
    setResState(s ? initialResults : mapResults)
  }

  useEffect(() => {
    if (mobileActivePro !== null && slickRef.current) {
      slickRef.current.slickGoTo(0)
      afterSliderChange(0)
    }
    //eslint-disable-next-line
  }, [results?.data])

  const onMarkerClick = useCallback(
    (index?: number | null) => {
      if (index !== undefined && index !== null) {
        slickRef.current?.slickGoTo(index)
        setMobileActivePro(index)
        if (!isGridView) {
          toggleGridView(true)
        }
      }
    },
    //eslint-disable-next-line
    [map, isGridView]
  )

  const resetPage = () => {
    setPage(1)
  }

  useEffect(() => {
    if (results?.viewport) {
      map?.fitBounds({
        north: results.viewport.northeast.lat,
        south: results.viewport.southwest.lat,
        east: results.viewport.northeast.lng,
        west: results.viewport.southwest.lng,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results?.viewport])

  return (
    <BaseLayout
      seoDescription={getSearchPageTitle(router.query)}
      seoTitle={getSearchPageTitle(router.query)}
    >
      {!(isTablet || isSmall) && isRendered ? (
        <div
          id="app_layout"
          className="hidden grid-rows-[72px_1fr] small:grid tablet:grid-rows-[82px_1fr]"
        >
          <MainHeader hideOnMobile />
          {/* DESKTOP */}
          {error ? (
            <SearchError error={error} isDesktop />
          ) : (
            <div
              ref={refContainer}
              className="relative items-start hidden overflow-y-scroll small:flex"
            >
              <SearchResultsSection
                resetPage={resetPage}
                results={resState}
                toggleGridView={toggleGridView}
                isGridView={isGridView}
              />

              {isGridView ? null : (
                <div className="sticky top-0 right-0 z-20 w-full  maxTablet:h-[calc(100vh-72px)] tablet:h-[calc(100vh-82px)] overflow-hidden">
                  <div className={`relative h-full w-full`}>
                    {loading ? (
                      <div className="absolute z-10 w-full h-full transition-all bg-slate-100/40" />
                    ) : null}
                    <SearchMapControls
                      map={map}
                      changeGridView={() => toggleGridView(true)}
                    />
                    <GoogleMapReact
                      {...standardMapOptions}
                      options={{
                        ...standardMapOptions.options,
                      }}
                      onGoogleApiLoaded={({ map }: { map: google.maps.Map }) =>
                        setMap(map)
                      }
                      yesIWantToUseGoogleMapApiInternals
                      defaultZoom={10}
                      defaultCenter={defaultCenter}
                      onChange={() => {
                        fitMap()
                      }}
                    >
                      {currentPosition ? (
                        <CurrentPositionMarker
                          lat={currentPosition.lat}
                          lng={currentPosition.lng}
                        />
                      ) : null}
                      {results?.data?.map((s) => {
                        return s.latitude && s.longitude ? (
                          <MapMarker
                            lat={s.latitude}
                            lng={s.longitude}
                            key={s.id}
                            data={s}
                            onClick={() => onMarkerClick()}
                          />
                        ) : null
                      })}
                    </GoogleMapReact>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
      {/* MOBILE SECTION */}
      {(isTablet || isSmall) && isRendered ? (
        <div className="relative flex flex-col h-screen max-h-screen overflow-x-hidden scrollbar-none tablet:hidden">
          <div className={'fixed px-4 top-4 z-[1] w-full '}>
            {/*<SearchMobileInput*/}
            {/*  toggleGridView={toggleGridView}*/}
            {/*  isGridView={isGridView}*/}
            {/*/>*/}
            <NewMobileSearchInput
              toggleGridView={toggleGridView}
              isGridView={isGridView}
            />
          </div>
          {error ? (
            <SearchError error={error} />
          ) : (
            <>
              <div className="relative flex flex-col justify-end w-full h-full">
                <div className="absolute top-0 w-full h-full">
                  {loading ? (
                    <div className="absolute z-10 w-full h-full transition-all bg-slate-100/40" />
                  ) : null}
                  <GoogleMapReact
                    onGoogleApiLoaded={({ map }: { map: google.maps.Map }) =>
                      setMap(map)
                    }
                    {...standardMapOptions}
                    zoom={9}
                    onChange={() => {
                      fitMap()
                    }}
                  >
                    {currentPosition ? (
                      <CurrentPositionMarker
                        lat={currentPosition.lat}
                        lng={currentPosition.lng}
                      />
                    ) : null}
                    {results?.data.map((r, i) => {
                      return r.latitude && r.longitude ? (
                        <MobileMapMarker
                          onClick={() => {
                            onMarkerClick(i)
                          }}
                          isActive={mobileActivePro === i}
                          lat={r.latitude}
                          lng={r.longitude}
                          key={r.id}
                        />
                      ) : null
                    })}
                  </GoogleMapReact>
                </div>
                <div
                  className={`${mobileActivePro !== null ? 'block' : 'hidden'}`}
                >
                  <SearchResultsSlider
                    afterSliderChange={afterSliderChange}
                    results={resState}
                    ref={slickRef}
                  />
                </div>
              </div>

              <SearchMobileBottomSheet open={!isGridView} results={results} />
            </>
          )}
        </div>
      ) : null}
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const q = ctx.query
  const lat = q.lat || defaultLocation.lat
  const lng = q.lng || defaultLocation.lng
  const box = q.box as string
  const extendBox = q?.extendBox as string
  const params: any = {
    limit: SEARCH_LIMIT,
    page: q?.page || 1,
    // to identify that the request is from web
    source: 'web',
  }
  const token = await getToken(ctx)

  if (token?.role === 'PRO') {
    return {
      redirect: {
        destination: ROUTES.myProfile,
        permanent: false,
      },
    }
  }

  searchFilterKeys.forEach((k) => {
    if (q[k]) {
      params[k] = q[k]
    }
  })

  const headers: any = {}

  if (lat && lng) {
    headers[locationDefaultHeaders.lng] = lng
    headers[locationDefaultHeaders.lat] = lat
  }

  if (q.query) {
    params.query = q.query as string
  }

  if (box) {
    params.box = box
  }

  if (extendBox) {
    params.extendBox = true
  }

  if (q.countryCode) {
    params.countryCode = q.countryCode
  }
  const instance = await universalInstance(ctx)

  try {
    const data = await instance.get(getServerSideUrl(API_SEARCH.searchV2), {
      params,
      headers: headers,
    })
    return {
      props: {
        results: data.data,
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something went wrong, please try again.',
      },
    }
  }
}

export default SearchPage
