import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'

import {
  IconFacebookSmall,
  IconInstagramSmall,
  IconLogoWhite,
  IconMastercard,
  IconTiktok,
  IconTwitterSmall,
  IconVisa,
} from '@/assets/icons/icons'
import { ApplePayLink } from '@/components/common/ApplePayLink'
import { GooglePlayLink } from '@/components/common/GooglePlayLink'
import { H18, H20 } from '@/components/typography'
import { API_LINKS } from '@/core/consts/apiLinks'
import {
  BECOME_A_PRO_WEBSITE_URL,
  COMPANY_CALL,
  COMPANY_EMAIL,
  COMPANY_FACEBOOK,
  COMPANY_INSTAGRAM,
  COMPANY_TIKTOK,
  COMPANY_TWITTER,
} from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { useMediaScreen } from '@/hooks/useMediaScreen'

const Footer = ({ footerClassName }: { footerClassName?: string }) => {
  const { t } = useTranslation('common')
  const paymentMethods = [IconVisa, IconMastercard]
  const router = useRouter()
  const onClickLink = async () => {
    const scrollSection = document.getElementById('scroll_section')

    router.pathname !== API_LINKS.home && (await router.push(API_LINKS.home))
    await scrollSection?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { isTablet } = useMediaScreen()
  const { socialLinks, contactUs, additionalInfo } = useFooterConfig()
  return (
    <footer
      className={`bg-black small:pt-[62px] pt-10 pb-6 ${footerClassName || ''}`}
    >
      <div className="container">
        <div className="flex flex-wrap w-full small:pb-[62px] pb-10 small:gap-y-9">
          {/* general info */}
          <div className="w-full pb-10 laptop:w-auto small:w-1/2 small:pb-0">
            <div role={'button'} onClick={onClickLink} className="block mb-4">
              <IconLogoWhite />
            </div>

            <div className="flex items-center">
              <H18 color="text-gray" className="mr-4">
                {t('footer.we_accept')}
              </H18>
              <div className="space-x-3.5 flex">
                {paymentMethods.map((MethodIcon, i) => (
                  <MethodIcon key={i} />
                ))}
              </div>
            </div>
            <div
              className={`flex mt-8 ${
                isTablet
                  ? 'flex-col items-start gap-5'
                  : 'items-center space-x-5'
              }`}
            >
              <ApplePayLink type={'white'} />
              <GooglePlayLink />
            </div>
          </div>
          {/* additional info */}
          <Column
            className="desktop:ml-[175px] laptop:ml-[50px] laptop:w-auto small:w-1/2 small:ml-0 small:mr-0 mr-9 flex flex-col small:items-center"
            {...additionalInfo}
          />
          {/* contact us */}
          <Column
            className="desktop:ml-[175px] laptop:ml-[50px] laptop:w-auto w-1/2"
            {...contactUs}
          />
          {/* social links */}
          <div className="flex-col items-center hidden w-1/2 laptop:ml-auto small:flex laptop:w-auto">
            <H20 color="text-white" className="mb-4 font-semibold">
              {t('footer.our_social_media')}
            </H20>
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, link }) => (
                <a href={link} key={link} target="_blank" rel="noreferrer">
                  <Icon className="transition-colors text-gray hover:text-orange" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-px mb-8 bg-gray/50 small:mb-6" />
        <H18
          className="mb-6 text-center small:mb-0 small:text-left"
          color="text-gray"
        >
          ©{new Date().getFullYear()} Readyhubb. {t('footer.rights_reserved')}
        </H18>
        <div className="flex justify-center space-x-4 small:hidden">
          {socialLinks.map(({ Icon, link }) => (
            <a href={link} key={link} target="_blank" rel="noreferrer">
              <Icon className="transition-colors text-gray hover:text-orange" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

const useFooterConfig = () => {
  const session = useSession()
  const { t } = useTranslation('common')

  const additionalInfo: ColumnProps = {
    title: t('footer.additional_info'),
    items: [
      {
        link: BECOME_A_PRO_WEBSITE_URL,
        text: t('footer.become_a_pro'),
        id: 'become_a_pro',
      },
      {
        link: BECOME_A_PRO_WEBSITE_URL,
        text: t('footer.list_your_business'),
        id: 'list_your_business',
      },
      {
        link: ROUTES.faq,
        text: t('footer.faq_and_help'),
        id: 'faq_and_help',
      },
      {
        link: ROUTES.termsAndConditions,
        text: t('footer.terms'),
        id: 'terms',
      },
      {
        link: ROUTES.privacyPolicy,
        text: t('footer.privacy_policy'),
        id: 'privacy_policy',
      },
    ],
  }

  const contactUs: ColumnProps = {
    title: t('footer.contact_us'),
    items: [
      {
        text: 'Schedule A Call',
        link: COMPANY_CALL,
      },
      {
        text: COMPANY_EMAIL,
        link: `mailto:${COMPANY_EMAIL}`,
      },
    ],
  }

  const socialLinks = [
    {
      link: COMPANY_INSTAGRAM,
      Icon: IconInstagramSmall,
    },
    {
      link: COMPANY_FACEBOOK,
      Icon: IconFacebookSmall,
    },
    {
      link: COMPANY_TWITTER,
      Icon: IconTwitterSmall,
    },
    {
      link: COMPANY_TIKTOK,
      Icon: IconTiktok,
    },
  ]

  return {
    socialLinks,
    contactUs,
    additionalInfo:
      session.data?.user.role === 'PRO'
        ? {
            ...additionalInfo,
            items: additionalInfo.items.filter(
              ({ id }) => !['become_a_pro'].includes(id || '')
            ),
          }
        : additionalInfo,
  }
}

interface ColumnProps {
  title: string
  items: {
    text: string
    link: string
    id?: string
  }[]
  className?: string
}

const Column = ({ items, title, className = '' }: ColumnProps) => {
  return (
    <div className={`${className}`}>
      <p
        color="text-white"
        className="mb-3 font-semibold leading-6 text-white small:mb-4 small:text-20 small:leading-7 text-16"
      >
        {title}
      </p>
      <div className="flex flex-col small:space-y-3">
        {items.map(({ link, text }, index) => (
          <Link key={index} href={link}>
            <a target={'_blank'} className="w-max">
              <p className="leading-8 transition-colors hover:text-orange text-gray small:text-18 small:leading-6 text-14">
                {text}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Footer
