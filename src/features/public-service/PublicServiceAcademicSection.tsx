import { FaGraduationCap, FaMicroscope, FaStar } from 'react-icons/fa'
import { AnimatedSection, Container } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

const fallbackDegrees = [
  {
    icon: FaGraduationCap,
    title: 'Doctor of Medicine',
    institution: 'University of Gondar / Addis Ababa University',
    footer: 'Distinction in Clinical Practice',
    highlight: false,
  },
  {
    icon: FaMicroscope,
    title: 'Pathology Specialty',
    institution: 'Advanced diagnostic systems and laboratory management integration.',
    footer: 'Specialized Fellowship',
    highlight: false,
  },
  {
    icon: FaStar,
    title: 'Stanford GSB Seed',
    institution: 'Strategic Management and Innovation program for high-growth enterprises.',
    footer: 'Executive Leadership',
    highlight: true,
  },
]

export default function PublicServiceAcademicSection() {
  const { content } = useSiteContent()
  const section = content?.sections['public-service']
  const degrees = Array.isArray(section?.metadata?.education) && section.metadata.education.length > 0
    ? section.metadata.education
    : fallbackDegrees

  return (
    <section className="section-padding bg-paper">
      <Container>
        <AnimatedSection>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold mb-4">
            Academic Pedigree
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-12">
            Foundations of Clinical Mastery
          </h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-3 gap-6">
          {degrees.map((deg, i) => {
            const Icon = deg.icon || FaGraduationCap
            return (
              <AnimatedSection key={deg.title} delay={i * 0.08}>
                <div
                  className={`h-full flex flex-col p-7 ${
                    deg.highlight ? 'bg-teal text-white' : 'bg-white border border-rule text-ink'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center mb-6 ${
                      deg.highlight ? 'bg-white/20' : 'bg-paper'
                    }`}
                  >
                    <Icon size={16} className={deg.highlight ? 'text-white' : 'text-teal'} />
                  </div>

                  <h3
                    className={`font-serif text-lg font-light mb-2 ${
                      deg.highlight ? 'text-white' : 'text-ink'
                    }`}
                  >
                    {deg.title}
                  </h3>

                  <p
                    className={`text-sm font-light leading-relaxed flex-1 ${
                      deg.highlight ? 'text-white/75' : 'text-ink-mid'
                    }`}
                  >
                    {deg.institution}
                  </p>

                  <p
                    className={`mt-6 font-mono text-[9px] tracking-[0.2em] uppercase ${
                      deg.highlight ? 'text-white/50' : 'text-ink-muted'
                    }`}
                  >
                    {deg.footer}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
