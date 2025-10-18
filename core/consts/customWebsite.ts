import { IMenuLinkProps, TAboutTheme3 } from '@/types/customWebsite'

export const API_CUSTOM_WEBSITE = {
  getWebsite: '/v1/custom-pages',
  getSubdomains: '/v1/custom-pages/prerendering/subdomains',
  getFonts: '/v1/custom-pages/get-fonts',
}

export const MENU_LINKS: IMenuLinkProps = {
  about_us: {
    id: 'about_us',
    name: 'About',
    isInNavbar: true,
  },
  portfolio_pictures: {
    id: 'portfolio_pictures',
    name: 'Portfolio',
    isInNavbar: true,
  },
  services: {
    id: 'services',
    name: 'Services',
    isInNavbar: true,
  },
  business_hours: {
    id: 'business_hours',
    name: 'Business hours',
  },
  payment_policies: {
    id: 'payment_policies',
    name: 'Policies',
    isInNavbar: true,
  },
  inspiration_posts: {
    id: 'inspiration_posts',
    name: 'Inspirations',
  },
  reviews: {
    id: 'reviews',
    name: 'Reviews',
  },
  bnpl: {
    id: 'bnpl',
    name: 'Buy now, Pay later',
    name2: 'Buy now Pay later',
  },
  location: {
    id: 'location',
    name: 'Location',
  },
  faq: {
    id: 'faq',
    name: 'FAQ',
    isInNavbar: true,
  },
}

export const Theme3Text: TAboutTheme3 = {
  about:
    "Welcome to The Glam Room! I'm a nail tech with 4 years of experience specializing in creative nail art and stunning editorial nail designs. Whether you're looking for everyday glam or a bold statement look, I've got you covered. Book your appointment today and let’s create something beautiful! 💅✨",
}
