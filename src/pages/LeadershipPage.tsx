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
  const overview = (section?.metadata?.overview || {}) as {
    title?: string
    description?: string
  }

  useEffect(() => {
    document.title = seoPages.leadership.title
  }, [])

  return (
    <>
      <PageBanner
        title={overview.title || 'Leadership & Impact'}
        description={
          overview.description ||
          'Executive leadership spanning healthcare organizations, boards, and institutions.'
        }
      />
      <LeadershipExecutiveSection />
      <LeadershipBoardSection />
    </>
  )
}