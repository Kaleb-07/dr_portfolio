import { AnimatedSection, Container } from '@/components/shared'
import { personalStory } from '@/data/about'

export default function AboutStory() {
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
                <span className="section-tag">The Story</span>
                <span className="section-rule" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-8">
                A life in <em className="text-teal-mid not-italic">service</em>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="relative group max-w-sm mx-auto lg:mx-0">
                {/* Visual Accent Borders */}
                <div className="absolute inset-0 border border-gold/30 translate-x-3 translate-y-3 pointer-events-none transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                <div className="relative border border-rule p-2 bg-white shadow-sm overflow-hidden">
                  <img
                    src="/image.png"
                    alt="Dr. Girma Ababi Portrait"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/image.png'
                    }}
                    className="w-full h-auto object-cover grayscale transition-all duration-700 group-hover:grayscale-0 scale-100 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-8 text-center lg:text-left max-w-sm">
                <p className="font-serif text-lg italic font-light text-gold">
                  &ldquo;We don't just build healthcare facilities; we build the future of our nation's wellness.&rdquo;
                </p>
                <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mt-2">
                  — Dr. Girma Ababi, Founder
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right: Narrative chapters with dropcap */}
          <div className="lg:col-span-7 space-y-12 lg:pt-16">
            {[0, 1, 2].map((chapterIndex) => {
              const chunkSize = Math.ceil(personalStory.length / 3)
              const start = chapterIndex * chunkSize
              const end = Math.min(start + chunkSize, personalStory.length)
              const text = personalStory.slice(start, end)
              if (!text) return null
              return (
                <AnimatedSection key={chapterIndex} delay={chapterIndex * 0.15}>
                  <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold mb-4 border-b border-rule/30 pb-2">
                    Chapter {String(chapterIndex + 1).padStart(2, '0')}
                  </p>
                  <p className="text-base font-light text-ink-mid leading-[2.0] editorial-dropcap text-left md:text-justify">
                    {text}
                  </p>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
