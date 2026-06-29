import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { useSiteContent } from '@/hooks/useSiteContent'
import {
  FoundationOverviewSection,
  FoundationPillarsSection,
  FoundationProgramsSection,
  FoundationStoriesSection,
  FoundationFutureSection,
} from '@/features/foundation'

export default function FoundationPage() {
  const { content } = useSiteContent()
  const section = content?.sections.foundation_story || content?.sections.foundation

  const heroTitle = (section?.metadata?.heroTitle as string) || 'Foundation & Community Impact'
  const heroDescription =
    (section?.metadata?.heroDescription as string) ||
    'Building healthier communities through strategic philanthropy.'

  useEffect(() => {
    document.title = seoPages.foundation.title
  }, [])

  return (
    <>
      <PageBanner
        title={heroTitle}
        description={heroDescription}
      />
      <FoundationOverviewSection />
      <FoundationPillarsSection />
      <FoundationProgramsSection />
      <FoundationStoriesSection />
      <FoundationFutureSection />
    </>
  )
}
