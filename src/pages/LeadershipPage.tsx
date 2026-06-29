import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { useSiteContent } from '@/hooks/useSiteContent'
import {
  LeadershipExecutiveSection,
  LeadershipBoardSection,
} from '@/features/leadership'

export default function LeadershipPage() {
  const { content } = useSiteContent()
  const section = content?.sections.leadership || content?.sections.leadership_philosophy

  const heroTitle = (section?.metadata?.heroTitle as string) || 'Leadership & Impact'
  const heroDescription =
    (section?.metadata?.heroDescription as string) ||
    'Executive leadership spanning healthcare organizations, boards, and institutions.'

  useEffect(() => {
    document.title = seoPages.leadership.title
  }, [])

  return (
    <>
      <PageBanner
        title={heroTitle}
        description={heroDescription}
      />
      <LeadershipExecutiveSection />
      <LeadershipBoardSection />
    </>
  )
}
