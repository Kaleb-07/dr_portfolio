import { useEffect } from 'react'

import { AnimatedSection, Container } from '@/components/shared'
import PageBanner from '@/components/layout/PageBanner'
import ImageGallery from '@/components/shared/ImageGallery'
import { galleryItems } from '@/data/gallery'
import { seoPages } from '@/lib/seo'

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

      <section className="section-padding bg-paper">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Visual Archive</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              A <em className="text-teal-mid not-italic">visual</em> journey
            </h2>
          </AnimatedSection>
          <ImageGallery items={galleryItems} columns={3} />
        </Container>
      </section>
    </>
  )
}
