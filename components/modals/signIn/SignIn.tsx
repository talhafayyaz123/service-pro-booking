import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { memo, useCallback, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { checkOnboardingv2 } from '@/api/onboarding'
import {
  IconApple,
  // IconFacebookBlue,
  IconGoogleRainbow,
} from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { FormInput } from '@/components/common/FormInput'
import { BaseLink } from '@/components/common/links/BaseLink'
import { OrBorder } from '@/components/common/OrBorder'
import { Modal } from '@/components/modals/Modal'
import { H16, H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { setAuthCookies } from '@/core/helpers/cookieHelpers'
import { setValidate } from '@/core/helpers/formValidations'
import { getLastStep } from '@/features/accountSetup/helpers/check-step'
import { useCaptch } from '@/features/captcha/useCaptcha'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { authSelector } from '@/store/auth/authSelectors'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import { IAuthPayload, TAuthProviders } from '@/types/authTypes'

const SignIn = memo(() => {
  const { isSmall } = useMediaScreen()
  const buttonSize = useMemo(() => (isSmall ? '50' : '200'), [isSmall])
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const dispatch = useAppDispatch()
  const { currentModal } = useAppSelector(modalsSelector)
  const { isLoading } = useAppSelector(authSelector)
  const router = useRouter()
  const { data: session } = useSession()
  const methods = useForm<IAuthPayload>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      role: 'CLIENT',
    },
  })

  const { data: onboarding } = useQuery({
    queryKey: ['onboarding', 'pro', session?.user],
    queryFn: checkOnboardingv2,
    enabled: !!session?.user?.accessToken && session?.user?.role === 'PRO',
  })

  const signInWithSocial = async (provider: TAuthProviders) => {
    setAuthCookies({ path: router.asPath })
    await signIn(provider, {
      redirect: false,
    })
  }

  const onClose = useCallback(() => {
    dispatch(setModal({}))
    methods.reset({})
  }, [dispatch, methods])

  const disabled = () => {
    if (!methods.watch(['email', 'password']).every((el) => el)) {
      return true
    } else if (isLoading) {
      return true
    } else return !methods.formState.errors
  }
  const protectedAction = useCaptch('signIn')

  const onSubmit = async (data: IAuthPayload) => {
    const res = await signIn('credentials', {
      password: data.password,
      email: data.email,
      redirect: false,
    })
    if (res?.error?.includes('USER_NOT_FOUND')) {
      return methods.setError(
        'email',
        { type: 'custom', message: 'Wrong email' },
        { shouldFocus: true }
      )
    } else if (res?.error?.includes('WRONG_PASSWORD')) {
      methods.setError(
        'password',
        { type: 'custom', message: 'Wrong password' },
        { shouldFocus: true }
      )
    } else if (res?.error?.includes('EMAIL_SOCIAL_EXISTS')) {
      return methods.setError(
        'email',
        { type: 'custom', message: 'Wrong email' },
        { shouldFocus: true }
      )
    } else if (res?.error) {
      methods.setError(
        'email',
        { type: 'custom', message: t('errors.invalid_password') },
        { shouldFocus: true }
      )
      methods.setError(
        'password',
        { type: 'custom', message: t('errors.invalid_password') },
        { shouldFocus: true }
      )
    } else {
      if (onboarding && session?.user?.role === 'PRO') {
        const steps = onboarding?.steps
        const { last } = getLastStep({ steps })
        const path = {
          pathname: ROUTES.setup_pro,
          query: { step: last },
        }
        router.push(path, path)
      }
      onClose()
    }
  }

  return (
    <Modal
      title={<H24>{t('buttons.sign_in')}</H24>}
      onClose={onClose}
      maxWidth={503}
      outsideClose={false}
      isOpen={currentModal === MODALS_TYPE.SIGN_IN}
    >
      <div
        className={'w-full flex flex-col border-t pt-6 mt-6 border-lightGray'}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) =>
              protectedAction(() => onSubmit(data))
            )}
          >
            <FormInput
              rules={{
                required: { value: true, message: t('errors.required_field') },
                validate: setValidate,
              }}
              label={t('labels.enter_email')}
              name="email"
            />
            <div className={'mt-6'}>
              <FormInput
                rules={{
                  required: {
                    value: true,
                    message: t('errors.required_field'),
                  },
                }}
                label={t('labels.password')}
                type={'password'}
                name="password"
              />
            </div>
            <div className={'justify-end flex mt-3'}>
              <BaseLink
                line={false}
                linkType={'black'}
                className={'!font-normal'}
                size={'200'}
                href={ROUTES.forgotPassword}
              >
                {t('text.forgot_password')}
              </BaseLink>
            </div>{' '}
            <Button
              disabled={disabled()}
              type="submit"
              buttonType="orange"
              size={buttonSize}
              className="w-full mt-5"
            >
              {t('buttons.sign_in')}
            </Button>
          </form>
        </FormProvider>
        <OrBorder className={'my-6 small:my-8'} />
        <Button
          buttonType={'withIcon'}
          icon={<IconApple />}
          size={buttonSize}
          className={'w-full'}
          onClick={async () => {
            protectedAction(() => signInWithSocial('apple'))
          }}
        >
          {t('buttons.sign_in_apple')}
        </Button>
        {/* <Button
          buttonType={'withIcon'}
          icon={<IconFacebookBlue />}
          size={buttonSize}
          className={'w-full mt-5'}
          onClick={async () => {
            protectedAction(() => signInWithSocial('facebook'))
          }}
        >
          {t('buttons.sign_in_facebook')}
        </Button> */}
        <Button
          icon={<IconGoogleRainbow />}
          buttonType={'withIcon'}
          size={buttonSize}
          className={'w-full mt-5'}
          onClick={async () => {
            protectedAction(() => signInWithSocial('google'))
          }}
        >
          {t('buttons.sign_in_google')}
        </Button>
        <div className={'mt-5'}>
          <H16 className={'inline !text-gray'}>
            {t('text.dont_have_account')}{' '}
          </H16>
          <BaseLink
            line={false}
            linkType="black"
            type="button"
            size="200"
            className="whitespace-nowrap"
            onClick={() =>
              dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_UP }))
            }
          >
            {t('buttons.sign_Up')}
          </BaseLink>
        </div>
      </div>
    </Modal>
  )
})
export default SignIn
