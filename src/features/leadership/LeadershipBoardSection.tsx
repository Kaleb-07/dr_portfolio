import { useMemo } from 'react'
import { AnimatedSection, Container, Card } from '@/components/shared'
import { leadershipRoles } from '@/data/leadership'

const categoryLabels: Record<string, string> = {
  executive: 'Executive & Founder',
  board: 'Board & Advisory',
  advisory: 'Board & Advisory',
  founder: 'Executive & Founder',
}

export default function LeadershipBoardSection() {
  const boardRoles = useMemo(
    () => leadershipRoles.filter((r) => r.category === 'board' || r.category === 'advisory'),
    [],
  )

  return (
    <section className="section-padding bg-paper-warm">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Governance</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
            Board & <em className="text-teal-mid not-italic">advisory</em> memberships
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boardRoles.map((role, i) => (
            <AnimatedSection key={role.id} delay={i * 0.05}>
              <Card className="bg-white border border-rule h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold">
                    {categoryLabels[role.category] ?? role.category}
                  </span>
                  <span className="text-xs text-ink-muted">{role.period}</span>
                </div>
                <h3 className="font-serif text-lg font-light text-ink mb-1">{role.title}</h3>
                <p className="text-sm text-teal mb-3">{role.organization}</p>
                <p className="text-sm font-light text-ink-mid leading-relaxed">{role.description}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
