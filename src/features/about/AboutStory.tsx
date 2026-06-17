import { AnimatedSection, Container } from '@/components/shared'
import { personalStory } from '@/data/about'

export default function AboutStory() {
  return (
    <section className="section-padding bg-paper">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <AnimatedSection>
              <div className="section-header">
                <span className="section-tag">The Journey</span>
                <span className="section-rule" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink">
                A life in <em className="text-teal-mid not-italic">service</em>
              </h2>
            </AnimatedSection>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 space-y-10">
            {[0, 1, 2].map((chapterIndex) => {
              const chunkSize = Math.ceil(personalStory.length / 3)
              const start = chapterIndex * chunkSize
              const end = Math.min(start + chunkSize, personalStory.length)
              const text = personalStory.slice(start, end)
              if (!text) return null
              return (
                <AnimatedSection key={chapterIndex} delay={chapterIndex * 0.1}>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-3">
                    Chapter {String(chapterIndex + 1).padStart(2, '0')}
                  </p>
                  <p className="text-base font-light text-ink-mid leading-[1.9]">{text}</p>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
