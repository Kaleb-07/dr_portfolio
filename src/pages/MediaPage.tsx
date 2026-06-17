import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { MediaListSection } from '@/features/media'

export default function MediaPage() {
  useEffect(() => {
    document.title = seoPages.media.title
  }, [])

  return (
    <>
      <PageBanner
        title="Media & Speaking"
        description="Thought leadership in healthcare transformation."
      />
      <MediaListSection />
    </>
  )
}

