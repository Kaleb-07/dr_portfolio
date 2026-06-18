import { AnimatedSection, Container } from '@/components/shared'
import ImageGallery from '@/components/shared/ImageGallery'
import { galleryItems } from '@/data/gallery'

export default function GalleryGridSection() {
  return (
    <section className="section-padding bg-paper relative overflow-hidden">
      {/* Ambient glow accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full blur-[100px] bg-teal-light" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full blur-[90px] bg-gold-light" />
      </div>

      <Container className="relative z-10">
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Visual Archive</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
            A <em className="text-teal-mid not-italic">visual</em> journey
          </h2>
          <p className="text-sm font-light text-ink-muted mb-14 max-w-xl">
            A curated archive of milestones, leadership moments, and community impact captured over the years.
          </p>
        </AnimatedSection>
        <ImageGallery items={galleryItems} columns={3} />
      </Container>
    </section>
  )
}
