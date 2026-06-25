import { useEffect } from 'react'
import { useSiteContent } from '@/hooks/useSiteContent'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  EcosystemNetworkSection,
  EcosystemBreakdownSection,
  EcosystemVisionSection,
} from '@/features/ecosystem'

export default function EcosystemPage() {
  const { content } = useSiteContent()
  const section = content?.sections.liyana_framework
  const ecosystemMeta = (section?.metadata?.ecosystem || {}) as {
    hero?: { title?: string; description?: string }
  }

  useEffect(() => {
    document.title = seoPages.ecosystem.title
  }, [])

  return (
    <>
      <PageBanner
        title={ecosystemMeta.hero?.title || section?.title || 'Healthcare Ecosystem'}
        description={
          ecosystemMeta.hero?.description ||
          section?.description ||
          'Most investors build one piece. Dr. Girma Ababi built the entire chain — vertically integrating every touchpoint of the patient journey.'
        }
      />
      <EcosystemNetworkSection />
      <EcosystemBreakdownSection />
      <EcosystemVisionSection />
    </>
  )
}
