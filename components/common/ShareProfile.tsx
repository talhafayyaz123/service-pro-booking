import Tippy from '@tippyjs/react/headless'
import { useRouter } from 'next/router'
import { ReactNode, useRef, useState } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { Placement } from 'tippy.js'

import {
  IconCopy,
  IconFacebookShare,
  IconShareProfile,
  IconTwitterShare,
  IconWhatsapp,
} from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { H12, H24 } from '@/components/typography'

export const ShareProfile = ({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) => {
  const tippyInstance = useRef<any | null>(null)
  const [show, setShow] = useState(false)

  const onShow = () => {
    tippyInstance.current?.show()
    setShow(true)
  }

  const onHide = () => {
    tippyInstance.current?.unmount()
    setShow(false)
  }
  return (
    <div>
      <Tippy
        delay={[500, 500]}
        animation={true}
        interactive={true}
        visible={show}
        onCreate={(instance) => {
          tippyInstance.current = instance
        }}
        onMount={() => setShow(true)}
        onHide={() => setShow(false)}
        onClickOutside={(instance) => {
          instance.unmount()
          setShow(false)
        }}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 20],
              },
            },
          ],
        }}
        render={(attrs, _) => {
          return (
            <div id="tooltip" role="tooltip" {...attrs}>
              <TooltipContent onClose={onHide} />
              <Arrow position={attrs['data-placement']} />
            </div>
          )
        }}
      >
        <div>
          <Button
            onClick={onShow}
            className={`${className} !gap-0`}
            buttonType="withIcon"
            size="44"
          >
            <div className="flex items-center justify-center w-full h-full">
              {children || (
                <>
                  <IconShareProfile className={'stroke-black'} />
                  Share
                </>
              )}
            </div>
          </Button>
        </div>
      </Tippy>
    </div>
  )
}

export const TooltipContent = ({ onClose }: { onClose: () => void }) => {
  const route = useRouter()

  const url = process.env.NEXT_PUBLIC_SITE_URL + route.asPath

  return (
    <div className="shadow-xl bg-white rounded-[24px] px-6 maxTablet:pt-0 pt-6 pb-7 text-center flex flex-col items-center">
      <H24>Share Profile</H24>
      <div className="flex gap-6 mt-6">
        <Wrapper onClose={onClose}>
          <div
            className="bg-lightGray w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-pointer flex-none"
            role="button"
            onClick={() => navigator.clipboard.writeText(url)}
          >
            <IconCopy width={36} height={36} viewBox="0 0 24 24" />
          </div>
          <H12>Copy Link</H12>
        </Wrapper>
        <Wrapper onClose={onClose}>
          <WhatsappShareButton url={url}>
            <IconWhatsapp />
          </WhatsappShareButton>
          <H12>WhatsApp</H12>
        </Wrapper>

        <Wrapper onClose={onClose}>
          <FacebookShareButton url={url}>
            <IconFacebookShare />
          </FacebookShareButton>
          <H12>Facebook</H12>
        </Wrapper>
        <Wrapper onClose={onClose}>
          <TwitterShareButton url={url}>
            <IconTwitterShare />
          </TwitterShareButton>
          <H12>Twitter</H12>
        </Wrapper>
      </div>{' '}
    </div>
  )
}
const Wrapper = ({
  children,
  onClose,
}: {
  children: ReactNode
  onClose: () => void
}) => {
  return (
    <div
      role={'button'}
      onClick={onClose}
      className={'flex flex-col justify-between gap-2 w-[56px] h-[56px]'}
    >
      {children}
    </div>
  )
}

const Arrow = ({ position }: { position: Placement }) => {
  const getId = () => {
    if (position === 'top') {
      return 'tooltipArrowTBottom'
    } else {
      return 'tooltipArrowTop'
    }
  }
  return (
    <div
      className={'transform translate-x-1/2 -translate-y-1/2'}
      id={getId()}
    />
  )
}
