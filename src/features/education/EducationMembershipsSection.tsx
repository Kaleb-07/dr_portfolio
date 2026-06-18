import { AnimatedSection, Container } from '@/components/shared'
import { professionalMemberships } from '@/data/education'
import { FaMedal } from 'react-icons/fa'

export default function EducationMembershipsSection() {
  return (
    <section className="section-padding bg-paper-warm relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-[300px] h-[300px] rounded-full blur-[80px] bg-gold-light" />
      </div>

      <Container className="relative z-10">
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Affiliations</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
            Professional <em className="text-teal-mid not-italic">memberships</em>
          </h2>
          <p className="text-sm font-light text-ink-muted mb-14 max-w-2xl">
            Active roles across national and international professional bodies in healthcare leadership and community service.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto border-t border-rule divide-y divide-rule">
          {professionalMemberships.map((membership, i) => (
            <AnimatedSection key={membership} delay={i * 0.08}>
              <div className="flex items-center gap-5 py-6 group cursor-default hover:bg-white/60 px-4 transition-all duration-300">
                <div className="w-9 h-9 rounded-full border border-gold/30 bg-gold-light/50 flex items-center justify-center shrink-0 group-hover:bg-gold-light group-hover:border-gold/60 transition-all duration-300">
                  <FaMedal size={13} className="text-gold" />
                </div>
                <span className="text-sm font-light text-ink-mid group-hover:text-ink transition-colors duration-200 leading-relaxed">
                  {membership}
                </span>
                <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-6 h-[0.5px] bg-teal" />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
