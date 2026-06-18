import { useMemo } from 'react'
import { AnimatedSection, Container } from '@/components/shared'
import { leadershipRoles } from '@/data/leadership'

export default function LeadershipBoardSection() {
  const boardRoles = useMemo(
    () => leadershipRoles.filter((r) => r.category === 'board' || r.category === 'advisory'),
    [],
  )

  return (
    <section className="section-padding bg-paper-warm relative overflow-hidden">
      {/* Ambient accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute bottom-10 -left-10 w-[300px] h-[300px] rounded-full blur-[90px] bg-gold-light" />
      </div>

      <Container className="relative z-10">
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Governance</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
            Board & <em className="text-teal-mid not-italic">advisory</em> memberships
          </h2>
          <p className="text-sm font-light text-ink-mid leading-relaxed max-w-xl mb-14">
            Governance roles across healthcare institutions, civil society, and professional organisations.
          </p>
        </AnimatedSection>

        {/* Roster manifest — horizontal rows, no cards */}
        <div className="border-t border-rule divide-y divide-rule">
          {boardRoles.map((role, i) => (
            <AnimatedSection key={role.id} delay={i * 0.1}>
              <div className="py-8 grid md:grid-cols-12 gap-6 items-start group hover:bg-white/40 px-4 transition-colors duration-300">

                {/* Col 1: Index + badge */}
                <div className="md:col-span-2 flex items-center md:flex-col md:items-start gap-3">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="badge-gold">{role.category}</span>
                </div>

                {/* Col 2: Title + org + period */}
                <div className="md:col-span-4">
                  <h3 className="font-serif text-xl font-light text-ink mb-1 group-hover:text-teal transition-colors duration-300">
                    {role.title}
                  </h3>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-teal-mid mb-2">
                    {role.organization}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-muted">
                    {role.period}
                  </p>
                </div>

                {/* Col 3: Description + highlights */}
                <div className="md:col-span-6">
                  <p className="text-sm font-light text-ink-mid leading-relaxed mb-4">
                    {role.description}
                  </p>
                  {role.highlights.length > 0 && (
                    <div className="space-y-2">
                      {role.highlights.map((h, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <span className="w-3 h-px bg-gold mt-2.5 shrink-0" />
                          <p className="text-sm font-light text-ink-muted leading-relaxed">{h}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
