import { mainNavigation } from '@/constants/navigation'
import { siteConfig } from '@/constants/site'
import heroData from '@/data/hero'
import { impactMetrics } from '@/data/metrics'

export interface CmsBlock {
  id: number
  section_id: number
  block_type: string
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  image_url?: string | null
  image_alt?: string | null
  metadata?: Record<string, unknown>
  sort_order: number
  is_active: number
}

export interface CmsSection {
  id: number
  slug: string
  section_type: string
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  description?: string | null
  image_url?: string | null
  image_alt?: string | null
  metadata?: {
    cta?: Array<{ label: string; path: string; variant?: string }>
    [key: string]: unknown
  }
  blocks: CmsBlock[]
}

export interface IdentityItem {
  id: number
  label?: string | null
  title: string
  description?: string | null
  icon?: string | null
  image_url?: string | null
  sort_order: number
}

export interface TimelineEvent {
  id: number
  slug?: string | null
  year?: string | null
  title: string
  subtitle?: string | null
  description?: string | null
  category: 'career' | 'education' | 'award' | 'milestone'
  icon?: string | null
  sort_order: number
}

export interface NavigationItem {
  id: number
  parent_id?: number | null
  label: string
  path?: string | null
  target?: string | null
  sort_order: number
  children?: NavigationItem[]
}

export interface SiteContent {
  sections: Record<string, CmsSection>
  identityItems: IdentityItem[]
  timelineEvents: TimelineEvent[]
  navigation: NavigationItem[]
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const defaultSections: Record<string, CmsSection> = {
  vision_agenda: {
    id: 0,
    slug: 'vision_agenda',
    section_type: 'hero_agenda',
    eyebrow: siteConfig.hero.eyebrow,
    title: heroData.title,
    subtitle: heroData.subtitle,
    description: heroData.description,
    image_url: heroData.backgroundImage,
    image_alt: heroData.name,
    metadata: {
      metrics: impactMetrics,
      cta: heroData.cta,
    },
    blocks: [
      { id: 0, section_id: 0, block_type: 'identity_teaser', title: 'Physician', eyebrow: 'Identity I', sort_order: 1, is_active: 1 },
      { id: 1, section_id: 0, block_type: 'identity_teaser', title: 'Entrepreneur', eyebrow: 'Identity II', sort_order: 2, is_active: 1 },
      { id: 2, section_id: 0, block_type: 'identity_teaser', title: 'Nation Builder', eyebrow: 'Identity III', sort_order: 3, is_active: 1 },
    ],
  },
  leadership_philosophy: {
    id: 0,
    slug: 'leadership_philosophy',
    section_type: 'quote',
    eyebrow: siteConfig.philosophy.label,
    title: null,
    subtitle: siteConfig.philosophy.attribution,
    description: siteConfig.philosophy.quote,
    blocks: [],
  },
}

export const defaultContent: SiteContent = {
  sections: defaultSections,
  identityItems: [],
  timelineEvents: [],
  navigation: mainNavigation.map((item, index) => ({
    id: index + 1,
    parent_id: null,
    label: item.label,
    path: item.path,
    target: '_self',
    sort_order: index,
  })),
}

function normalizeContent(raw: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    sections: {
      ...defaultContent.sections,
      ...(raw?.sections || {}),
    },
    identityItems: raw?.identityItems?.length ? raw.identityItems : defaultContent.identityItems,
    timelineEvents: raw?.timelineEvents?.length ? raw.timelineEvents : defaultContent.timelineEvents,
    navigation: raw?.navigation?.length ? raw.navigation : defaultContent.navigation,
  }
}

export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const response = await fetch(`${API_BASE}/cms/site-content`, { cache: 'no-store' })

    if (!response.ok) {
      return defaultContent
    }

    const data = (await response.json()) as Partial<SiteContent>
    return normalizeContent(data)
  } catch {
    return defaultContent
  }
}
