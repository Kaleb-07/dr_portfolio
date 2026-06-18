import { useMemo } from 'react'
import { AnimatedSection, Container } from '@/components/shared'
import { leadershipRoles } from '@/data/leadership'

export default function LeadershipExecutiveSection() {
  const executiveRoles = useMemo(
    () => leadershipRoles.filter((r) => r.category === 'executive' || r.category === 'founder'),
    [],
  )

  return (
    <section className="section-padding bg-paper relative overflow-hidden">
      {/* Ambient accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/3 -right-20 w-[300px] h-[300px] rounded-full blur-[80px] bg-teal-light" />
      </div>

      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Executive</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-16">
            Founder & <em className="text-teal-mid not-italic">executive</em> leadership
          </h2>
        </AnimatedSection>

        {/* Editorial numbered rows — no cards */}
        <div className="border-t border-rule divide-y divide-rule max-w-5xl">
          {executiveRoles.map((role, i) => (
            <AnimatedSection key={role.id} delay={i * 0.12}>
              <div className="py-12 md:py-16 grid md:grid-cols-12 gap-8 items-start group">

                {/* Left col: large number watermark + badge */}
                <div className="md:col-span-3 flex flex-col gap-4">
                  <span
                    className="font-serif text-[5rem] md:text-[7rem] font-light leading-none text-rule/50 group-hover:text-teal-light/80 transition-colors duration-500 select-none"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="badge-teal self-start">{role.category}</span>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold">
                    {role.period}
                  </p>
                </div>

                {/* Right col: full role content */}
                <div className="md:col-span-9 md:border-l border-rule md:pl-10 group-hover:border-teal/30 transition-colors duration-300 relative">
                  {/* Hover top accent line */}
                  <div className="absolute top-0 left-0 md:left-10 right-0 h-[2px] bg-gradient-to-r from-teal to-teal-mid origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                  <h3 className="font-serif text-2xl md:text-3xl font-light text-ink mb-1 group-hover:text-teal transition-colors duration-300">
                    {role.title}
                  </h3>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-teal-mid mb-6">
                    {role.organization}
                  </p>
                  <p className="text-sm font-light text-ink-mid leading-relaxed mb-8">
                    {role.description}
                  </p>

                  {/* Highlights as indented dash list */}
                  {role.highlights.length > 0 && (
                    <div className="border-l-2 border-gold/40 pl-6 space-y-3">
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-4">
                        Key Highlights
                      </p>
                      {role.highlights.map((h, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <span className="w-4 h-px bg-teal mt-2.5 shrink-0" />
                          <p className="text-sm font-light text-ink-mid leading-relaxed">{h}</p>
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
