import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { GalleryGridSection } from '@/features/gallery'

export default function GalleryPage() {
  useEffect(() => {
    document.title = seoPages.gallery.title
  }, [])

  return (
    <>
      <PageBanner
        title="Gallery"
        description="Moments that define a legacy of healthcare leadership."
      />
      <GalleryGridSection />
    </>
  )
}

