import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { AwardsList } from '@/features/awards'

export default function AwardsPage() {
  useEffect(() => {
    document.title = seoPages.awards.title
  }, [])

  return (
    <>
      <PageBanner
        title="Awards & Recognition"
        description="Celebrating excellence in healthcare leadership and service."
      />
      <AwardsList />
    </>
  )
}

