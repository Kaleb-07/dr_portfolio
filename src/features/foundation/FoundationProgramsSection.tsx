import { AnimatedSection, Container, Card } from '@/components/shared'
import { programs } from '@/data/foundation'

export default function FoundationProgramsSection() {
  return (
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
  )
}
