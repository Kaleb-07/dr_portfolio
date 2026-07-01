import { cmsContent } from '@/data/cms-content'

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
  is_active: boolean // was: number
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
  category: string // was: 'career' | 'education' | 'award' | 'milestone'
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

export interface ContactSettings {
  heading: string
  email: string
  phone: string
  location: string
  image_url: string
  image_caption: string
}

export interface SiteContent {
  sections: Record<string, CmsSection>
  sectionOrder: string[]
  identityItems: IdentityItem[]
  timelineEvents: TimelineEvent[]
  navigation: NavigationItem[]
  contact: ContactSettings | null
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const defaultContent: SiteContent = {
  ...cmsContent,
  sections: cmsContent.sections || {},
  sectionOrder: cmsContent.sectionOrder || [],
  identityItems: cmsContent.identityItems || [],
  timelineEvents: cmsContent.timelineEvents || [],
  navigation: cmsContent.navigation || [],
  contact: cmsContent.contact || null,
}

function normalizeContent(raw: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    sections: {
      ...defaultContent.sections,
      ...(raw?.sections || {}),
    },
    sectionOrder: raw?.sectionOrder?.length ? raw.sectionOrder : defaultContent.sectionOrder,
    identityItems: raw?.identityItems?.length ? raw.identityItems : defaultContent.identityItems,
    timelineEvents: raw?.timelineEvents?.length
      ? raw.timelineEvents
      : defaultContent.timelineEvents,
    navigation: raw?.navigation?.length ? raw.navigation : defaultContent.navigation,
    contact: raw?.contact ?? defaultContent.contact,
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
