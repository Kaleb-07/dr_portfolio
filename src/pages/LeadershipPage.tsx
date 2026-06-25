import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  LeadershipExecutiveSection,
  LeadershipBoardSection,
} from '@/features/leadership'

export default function LeadershipPage() {
  useEffect(() => {
    document.title = seoPages.leadership.title
  }, [])

  return (
    <>
      <PageBanner
        title="Leadership & Impact"
        description="Executive leadership spanning healthcare organizations, boards, and institutions."
      />
      <LeadershipExecutiveSection />
      <LeadershipBoardSection />
    </>
  )
}
