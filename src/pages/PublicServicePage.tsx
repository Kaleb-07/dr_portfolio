import { useEffect } from 'react'
import { useSiteContent } from '@/hooks/useSiteContent'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  PublicServiceRolesSection,
  PublicServiceAcademicSection,
  PublicServiceFoundationSection,
  PublicServiceContactSection,
} from '@/features/public-service'

export default function PublicServicePage() {
  const { content } = useSiteContent()
  const section = content?.sections['public-service']
  const overview = (section?.metadata?.overview || {}) as {
    title?: string
    description?: string
  }

  useEffect(() => {
    document.title = seoPages['public-service'].title
  }, [])

  return (
    <>
      <PageBanner
        title={overview.title || section?.title || 'Public Service & Policy Impact'}
        description={
          overview.description ||
          section?.description ||
          'Dr. Girma Ababi serves the nation through advisory roles, federation leadership, and innovation boards — shaping healthcare at the highest levels.'
        }
      />
      <PublicServiceRolesSection />
      <PublicServiceAcademicSection />
      <PublicServiceFoundationSection />
      <PublicServiceContactSection />
    </>
  )
}
