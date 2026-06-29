import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  FoundationOverviewSection,
  FoundationProgramsSection,
  FoundationStoriesSection,
  FoundationFutureSection,
} from '@/features/foundation'

export default function FoundationPage() {
  useEffect(() => {
    document.title = seoPages.foundation.title
  }, [])

  return (
    <>
      <PageBanner
        title="Foundation & Community Impact"
        description="Building healthier communities through strategic philanthropy."
      />
      <FoundationOverviewSection />
      <FoundationProgramsSection />
      <FoundationStoriesSection />
      <FoundationFutureSection />
    </>
  )
}
