import { AnimatedSection, Container } from '@/components/shared'
import { professionalMemberships } from '@/data/education'

export default function EducationMembershipsSection() {
  return (
    <section className="section-padding bg-paper-warm">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Affiliations</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-8">
            Professional <em className="text-teal-mid not-italic">memberships</em>
          </h2>
        </AnimatedSection>
        <div className="flex flex-wrap justify-center gap-3">
          {professionalMemberships.map((membership, i) => (
            <AnimatedSection key={membership} delay={i * 0.05}>
              <span className="inline-block border border-rule bg-white px-4 py-2 text-xs font-light text-ink-mid tracking-wide">
                {membership}
              </span>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
