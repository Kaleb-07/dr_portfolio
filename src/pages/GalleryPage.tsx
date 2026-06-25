import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { useSiteContent } from '@/hooks/useSiteContent'
import { seoPages } from '@/lib/seo'
import { GalleryGridSection } from '@/features/gallery'

export default function GalleryPage() {
  useEffect(() => {
    document.title = seoPages.gallery.title
  }, [])
  const { content } = useSiteContent()
  const section = content?.sections?.about_gallery

  return (
    <>
      <PageBanner
        title={section?.title || 'Gallery'}
        description={section?.description || 'Moments that define a legacy of healthcare leadership.'}
      />
      <GalleryGridSection />
    </>
  )
}
