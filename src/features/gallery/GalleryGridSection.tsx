import { AnimatedSection, Container } from '@/components/shared'
import ImageGallery from '@/components/shared/ImageGallery'
import { galleryItems } from '@/data/gallery'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function GalleryGridSection() {
  const { content } = useSiteContent()
  const cmsGallery =
    content?.sections.about_gallery?.blocks?.map((block) => ({
      id: String(block.id),
      src: block.image_url || '',
      alt: block.image_alt || block.title || '',
      caption: block.body || '',
      category: (block.metadata?.category || 'community') as
        | 'leadership'
        | 'healthcare'
        | 'education'
        | 'awards'
        | 'community'
        | 'conferences',
      date: String(block.metadata?.date || ''),
      location: String(block.metadata?.location || ''),
    })) || []
  const items = cmsGallery.length ? cmsGallery : galleryItems

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
            <span className="section-tag">{content?.sections.about_gallery?.eyebrow || 'Visual Archive'}</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
            {content?.sections.about_gallery?.title || (
              <>
                A <em className="text-teal-mid not-italic">visual</em> journey
              </>
            )}
          </h2>
          <p className="text-sm font-light text-ink-muted mb-8 sm:mb-14 max-w-xl">
            {content?.sections.about_gallery?.description ||
              'A curated archive of milestones, leadership moments, and community impact captured over the years.'}
          </p>
        </AnimatedSection>
        <ImageGallery items={items} columns={3} />
      </Container>
    </section>
  )
}
