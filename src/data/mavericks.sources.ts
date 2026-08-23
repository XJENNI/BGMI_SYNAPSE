import { mavericksPageData } from './mavericks';

export const mavericksSourceMap = {
  hero: {
    title: mavericksPageData.hero.source,
    subtitle: mavericksPageData.hero.source
  },
  about: {
    lines: mavericksPageData.about.source
  },
  relationship: {
    synapse: mavericksPageData.relationship.source
  },
  activities: mavericksPageData.activities.map((item) => ({
    event: item.name,
    source: item.source
  })),
  social: mavericksPageData.social,
  coreImages: mavericksPageData.coreImages.map((item) => ({
    image: item.label,
    source: item.source
  }))
} as const;
