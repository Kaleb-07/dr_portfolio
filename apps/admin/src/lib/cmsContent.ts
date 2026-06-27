import api from '../api'

export type CmsBlock = Record<string, any>
export type CmsSection = Record<string, any> & { blocks?: CmsBlock[] }
export type SiteContent = {
  sections?: Record<string, CmsSection>
  identityItems?: any[]
  timelineEvents?: any[]
  navigation?: any[]
}

export async function fetchSiteContent() {
  const response = await api.get('/cms/site-content')
  return (response.data || {}) as SiteContent
}

export async function fetchSection(slug: string) {
  const content = await fetchSiteContent()
  return content.sections?.[slug] || null
}

export async function saveSection(
  slug: string,
  section: Record<string, any>,
  blocks: CmsBlock[] = [],
) {
  return api.put(`/cms/sections/${slug}`, { section, blocks })
}
