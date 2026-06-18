import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  PublicServiceRolesSection,
  PublicServiceAcademicSection,
  PublicServiceFoundationSection,
  PublicServiceContactSection,
} from '@/features/public-service'

export default function PublicServicePage() {
  useEffect(() => {
    document.title = seoPages['public-service'].title
  }, [])

  return (
    <>
      <PageBanner
        title="Public Service & Policy Impact"
        description="Dr. Girma Ababi serves the nation through advisory roles, federation leadership, and innovation boards — shaping healthcare at the highest levels."
      />
      <PublicServiceRolesSection />
      <PublicServiceAcademicSection />
      <PublicServiceFoundationSection />
      <PublicServiceContactSection />
    </>
  )
}
