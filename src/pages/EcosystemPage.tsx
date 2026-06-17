import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  EcosystemNetworkSection,
  EcosystemBreakdownSection,
  EcosystemVisionSection,
} from '@/features/ecosystem'

export default function EcosystemPage() {
  useEffect(() => {
    document.title = seoPages.ecosystem.title
  }, [])

  return (
    <>
      <PageBanner
        title="Healthcare Ecosystem"
        description="Most investors build one piece. Dr. Liyana built the entire chain — vertically integrating every touchpoint of the patient journey."
      />
      <EcosystemNetworkSection />
      <EcosystemBreakdownSection />
      <EcosystemVisionSection />
    </>
  )
}
