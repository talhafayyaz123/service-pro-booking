import { ISocialLinkProps, IWebsiteDataProps } from '@/types/customWebsite'

export const getSocialLinks = (data: IWebsiteDataProps) => {
  const socials: ISocialLinkProps[] = []

  if (data.websiteUrl) {
    socials.push({
      type: 'website',
      href: data.websiteUrl,
    })
  }

  if (data.facebookUrl) {
    socials.push({
      type: 'facebook',
      href: data.facebookUrl,
    })
  }

  if (data.instagramUrl) {
    socials.push({
      type: 'instagram',
      href: data.instagramUrl,
    })
  }

  if (data.tiktokUrl) {
    socials.push({
      type: 'tiktok',
      href: data.tiktokUrl,
    })
  }

  if (data.twitterUrl) {
    socials.push({
      type: 'twitter',
      href: data.twitterUrl,
    })
  }

  if (data.pinterestUrl) {
    socials.push({
      type: 'pinterest',
      href: data.pinterestUrl,
    })
  }

  return socials
}
