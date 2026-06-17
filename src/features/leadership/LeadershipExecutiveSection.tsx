import { useMemo } from 'react'
import { AnimatedSection, Container, Card } from '@/components/shared'
import { leadershipRoles } from '@/data/leadership'

const categoryLabels: Record<string, string> = {
  executive: 'Executive & Founder',
  board: 'Board & Advisory',
  advisory: 'Board & Advisory',
  founder: 'Executive & Founder',
}

export default function LeadershipExecutiveSection() {
  const executiveRoles = useMemo(
    () => leadershipRoles.filter((r) => r.category === 'executive' || r.category === 'founder'),
    [],
  )

  return (
    <section className="section-padding bg-paper">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Executive</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
            Founder & <em className="text-teal-mid not-italic">executive</em> leadership
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6">
          {executiveRoles.map((role, i) => (
            <AnimatedSection key={role.id} delay={i * 0.05}>
              <Card className="bg-white border border-rule h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal">
                    {categoryLabels[role.category] ?? role.category}
                  </span>
                  <span className="text-xs text-ink-muted">{role.period}</span>
                </div>
                <h3 className="font-serif text-xl font-light text-ink mb-1">{role.title}</h3>
                <p className="text-sm text-teal mb-3">{role.organization}</p>
                <p className="text-sm font-light text-ink-mid leading-relaxed mb-4">{role.description}</p>
                {role.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {role.highlights.map((h, j) => (
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
