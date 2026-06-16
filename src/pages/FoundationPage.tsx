import { useEffect } from 'react'

import { AnimatedSection, Container, Card } from '@/components/shared'
import PageBanner from '@/components/layout/PageBanner'
import { foundationOverview, programs, impactStories, futureVision } from '@/data/foundation'
import { seoPages } from '@/lib/seo'

export default function FoundationPage() {
  useEffect(() => {
    document.title = seoPages.foundation.title
  }, [])

  return (
    <>
      <PageBanner
        title="Foundation & Community Impact"
        description="Building healthier communities through strategic philanthropy."
      />

      {/* Overview */}
      <section className="section-padding bg-paper">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">Foundation</span>
                  <span className="section-rule" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-6">
                  The <em className="text-teal-mid not-italic">LUCS</em> Foundation
                </h2>
                <p className="text-sm font-light text-ink-mid leading-relaxed mb-8">
                  {foundationOverview.description}
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div className="space-y-6">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-2">Vision</p>
                    <p className="text-sm font-light text-ink-mid leading-relaxed">{foundationOverview.vision}</p>
                  </div>
                  <div className="border-rule" />
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-2">Mission</p>
                    <p className="text-sm font-light text-ink-mid leading-relaxed">{foundationOverview.mission}</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            <div className="grid grid-cols-2 gap-4 self-center">
              {[
                { value: '5+', label: 'Impact Pillars' },
                { value: '4', label: 'Board Chairmanships' },
                { value: '1', label: 'CSO Board Chair' },
                { value: '1000+', label: 'Lives Impacted' },
              ].map((stat, i) => (
                <AnimatedSection key={stat.label} delay={0.2 + i * 0.05}>
                  <div className="bg-white border border-rule p-6 text-center">
                    <p className="font-serif text-3xl font-light text-teal mb-1">{stat.value}</p>
                    <p className="text-xs font-light text-ink-muted">{stat.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="section-padding bg-paper-warm">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Programs</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              Our <em className="text-teal-mid not-italic">programs</em>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <AnimatedSection key={program.id} delay={i * 0.1}>
                <Card className="bg-white border border-rule h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-serif text-lg font-light text-ink">{program.title}</h3>
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal shrink-0 bg-teal-light px-2 py-1">
                      {program.status}
                    </span>
                  </div>
                  <p className="text-sm font-light text-ink-mid leading-relaxed flex-1 mb-4">{program.description}</p>
                  <div className="border-rule mb-3" />
                  <div className="space-y-1">
                    <p className="text-xs text-ink-muted"><span className="text-ink-mid">Impact:</span> {program.impact}</p>
                    <p className="text-xs text-ink-muted"><span className="text-ink-mid">Beneficiaries:</span> {program.beneficiaries}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact Stories */}
      <section className="section-padding bg-paper">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Impact</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              Stories of <em className="text-teal-mid not-italic">change</em>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {impactStories.map((story, i) => (
              <AnimatedSection key={story.title} delay={i * 0.15}>
                <Card className="bg-white border border-rule h-full">
                  <h3 className="font-serif text-lg font-light text-ink mb-3">{story.title}</h3>
                  <p className="text-sm font-light text-ink-mid leading-relaxed mb-4">{story.description}</p>
                  <div className="border-rule mb-3" />
                  <p className="text-xs text-teal">{story.beneficiary}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Future Vision */}
      <section className="bg-teal text-white text-center py-24">
        <Container className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 mb-6">Future Vision</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-8">Looking ahead</h2>
            <blockquote className="font-serif text-xl lg:text-2xl italic font-light text-white/80 leading-relaxed">
              &ldquo;{futureVision}&rdquo;
            </blockquote>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
