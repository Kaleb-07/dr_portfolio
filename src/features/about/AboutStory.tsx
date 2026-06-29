import { AnimatedSection, Container } from '@/components/shared'
import { personalStory } from '@/data/about'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AboutStory() {
  const { content } = useSiteContent()
  const section = content?.sections?.about_story

  // Metadata from the Journey editor (quote & attribution)
  const meta = (section?.metadata as any) || {}
  const quote = meta?.quote || "We don't just build healthcare facilities; we build the future of our nation's wellness."
  const attribution = meta?.attribution || 'Dr. Girma Ababi, Founder'

  const subtitle = section?.subtitle || 'A life in <em class="text-teal-mid not-italic">service</em>'

  // ... rest of the component remains unchanged ...
  return (
    <section className="section-padding bg-paper relative overflow-hidden">
      {/* Dynamic background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] rounded-full blur-[80px] bg-teal-light" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left: Portrait and Side Meta */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <AnimatedSection>
              <div className="section-header">
                <span className="section-tag">{section?.eyebrow || 'The Story'}</span>
                <span className="section-rule" />
              </div>
              <h2
                className="font-serif text-4xl md:text-5xl font-light text-ink mb-8"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="relative group max-w-sm mx-auto lg:mx-0">
                {/* Visual Accent Borders */}
                <div className="absolute inset-0 border border-gold/30 translate-x-3 translate-y-3 pointer-events-none transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                <div className="relative border border-rule p-2 bg-white shadow-sm overflow-hidden">
                  <img
                    src={section?.image_url || '/image.png'}
                    alt={section?.image_alt || 'Dr. Girma Ababi Portrait'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/image.png'
                    }}
                    className="w-full h-auto object-cover grayscale transition-all duration-700 group-hover:grayscale-0 scale-100 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-8 text-center lg:text-left max-w-sm">
                <p className="font-serif text-lg italic font-light text-gold">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mt-2">
                  — {attribution}
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right: Narrative chapters with dropcap */}
          <div className="lg:col-span-7 space-y-12 lg:pt-16">
            {(section && section.blocks && section.blocks.length > 0
              ? section.blocks.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              : // fallback: split local personalStory into 3 chunks
                Array.from({ length: 3 }).map((_, i) => {
                  const chunkSize = Math.ceil(personalStory.length / 3)
                  const start = i * chunkSize
                  const end = Math.min(start + chunkSize, personalStory.length)
                  return { title: null, body: personalStory.slice(start, end) }
                }))
              .map((block, idx) => (
                <AnimatedSection key={String(((block as { id?: unknown }).id) ?? idx)} delay={idx * 0.15}>
                  <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold mb-4 border-b border-rule/30 pb-2">
                    Chapter {String(idx + 1).padStart(2, '0')}
                  </p>
                  {block.title && <h3 className="text-lg font-semibold text-ink mb-2">{block.title}</h3>}
                  <p className="text-base font-light text-ink-mid leading-[2.0] editorial-dropcap text-left md:text-justify">
                    {block.body}
                  </p>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </Container>
    </section>
  )
}