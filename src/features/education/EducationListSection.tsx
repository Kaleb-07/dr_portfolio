import { AnimatedSection, Container, Card } from '@/components/shared'
import { education } from '@/data/education'

export default function EducationListSection() {
  return (
    <section className="section-padding bg-paper">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Credentials</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
            Academic <em className="text-teal-mid not-italic">foundations</em>
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {education.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              <Card className="bg-white border border-rule h-full">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-3">{item.year}</p>
                <h3 className="font-serif text-xl font-light text-ink mb-1">{item.degree}</h3>
                <p className="text-sm text-ink-mid mb-2">{item.institution}</p>
                <p className="text-xs text-ink-muted mb-4">{item.field}</p>
                <p className="text-sm font-light text-ink-mid leading-relaxed mb-4">{item.description}</p>
                {item.highlights.length > 0 && (
                  <ul className="space-y-1.5">
                    {item.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-ink-muted">
                        <span className="w-3 h-[0.5px] bg-teal mt-2 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
