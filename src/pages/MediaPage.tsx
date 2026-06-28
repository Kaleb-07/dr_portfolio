import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { MediaListSection } from '@/features/media'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function MediaPage() {
  const { content } = useSiteContent()
  const section = content?.sections?.media_speaking

  useEffect(() => {
    document.title = seoPages.media.title
  }, [])

  return (
    <>
      <PageBanner
        title={section?.title || 'Media & Speaking'}
        description={section?.description || 'Thought leadership in healthcare transformation.'}
      />
      <MediaListSection />
    </>
  )
}
