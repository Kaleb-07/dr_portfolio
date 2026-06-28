import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { AwardsList } from '@/features/awards'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AwardsPage() {
  const { content } = useSiteContent()
  const section = content?.sections?.recognition_awards

  useEffect(() => {
    document.title = seoPages.awards.title
  }, [])

  return (
    <>
      <PageBanner
        title={section?.title || 'Awards & Recognition'}
        description={
          section?.description || 'Celebrating excellence in healthcare leadership and service.'
        }
      />
      <AwardsList />
    </>
  )
}
