import { AnimatedSection, Container } from '@/components/shared'
import ImageGallery from '@/components/shared/ImageGallery'
import { galleryItems } from '@/data/gallery'

export default function GalleryGridSection() {
  return (
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
  )
}
