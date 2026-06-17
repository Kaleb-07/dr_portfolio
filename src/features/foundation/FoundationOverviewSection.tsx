import { AnimatedSection, Container } from '@/components/shared'
import { foundationOverview } from '@/data/foundation'

export default function FoundationOverviewSection() {
  return (
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
  )
}
