import { AnimatedSection, Container } from '@/components/shared'
import { journey } from '@/data/about'

export default function AboutTimeline() {
  return (
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
  )
}
