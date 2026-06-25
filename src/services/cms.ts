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

export async function fetchSiteContent(): Promise<SiteContent> {
  const response = await fetch(`${API_BASE}/cms/site-content`, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error('Could not load CMS content')
  }

  return response.json()
}
