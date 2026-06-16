import { useEffect } from 'react'

import { AnimatedSection, Container, Card } from '@/components/shared'
import PageBanner from '@/components/layout/PageBanner'
import { personalStory, leadershipPhilosophy, coreValues, vision, journey } from '@/data/about'
import { seoPages } from '@/lib/seo'

export default function AboutPage() {
  useEffect(() => {
    document.title = seoPages.about.title
  }, [])

  return (
    <>
      <PageBanner
        title="The Story"
        description="A life dedicated to healthcare leadership and transformation."
      />

      {/* Personal Story */}
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

      {/* Leadership Philosophy */}
      <section className="section-padding bg-paper-warm">
        <Container className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center">
            <div className="section-header justify-center">
              <span className="section-rule" />
              <span className="section-tag">Philosophy</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-8">
              Leadership philosophy
            </h2>
            <blockquote className="font-serif text-xl lg:text-2xl italic font-light text-ink-mid leading-relaxed max-w-3xl mx-auto">
              &ldquo;{leadershipPhilosophy}&rdquo;
            </blockquote>
          </AnimatedSection>
        </Container>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-paper">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Values</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              Principles that <em className="text-teal-mid not-italic">guide</em> every decision
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <Card className="bg-white border border-rule h-full">
                  <h3 className="font-serif text-xl font-light text-ink mb-3">{value.title}</h3>
                  <p className="text-sm font-light text-ink-mid leading-relaxed">{value.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Vision */}
      <section className="bg-teal text-white text-center py-24">
        <Container className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 mb-8">Vision</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-8">
              A healthier Africa
            </h2>
            <blockquote className="font-serif text-xl lg:text-2xl italic font-light text-white/80 leading-relaxed max-w-3xl mx-auto">
              &ldquo;{vision}&rdquo;
            </blockquote>
          </AnimatedSection>
        </Container>
      </section>

      {/* Journey Timeline */}
      <section className="section-padding bg-paper-warm">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Milestones</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              Key moments that <em className="text-teal-mid not-italic">defined</em> the journey
            </h2>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto space-y-6">
            {journey.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.03}>
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal shrink-0 w-12">
                    {item.year}
                  </span>
                  <div className="border-rule flex-1" />
                  <p className="text-sm font-light text-ink-mid">{item.milestone}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
