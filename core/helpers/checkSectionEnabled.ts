import { ISectionEnabledProps } from '@/types/customWebsite'

export const checkSectionEnabled = (
  sections: ISectionEnabledProps[],
  sectionName: string
) => {
  return sections.some((s) => s.name === sectionName && s.enabled)
}
