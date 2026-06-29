import { AnimatedSection, Container } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

const fallbackRoles = [
  {
    title: 'VP, Ethiopian Healthcare Federation',
    period: 'Current',
    description:
      'Leading strategic initiatives to unify the private healthcare sector with public health goals, ensuring quality standards and ethical growth across the federation.',
  },
  {
    title: 'Ministerial Policy Advisor',
    period: '2021 → Present',
    description:
      'Advising the Minister of Health on regulatory frameworks, public-private partnerships, and the integration of emerging technologies in clinical workflows.',
  },
  {
    title: 'Healthcare Think-Tank Member',
    period: 'Global Research',
    description:
      'Contributing to multi-lateral research on health system resilience and sustainable diagnostic access in developing economies.',
  },
  {
    title: 'National Regulatory Committee Member',
    period: 'Ongoing',
    description:
      'Participating in the Ministry of Health regulatory committee, ensuring compliance frameworks uphold quality and safety standards nationwide.',
  },
]

// Helper to safely get highlights as array
const getHighlights = (role: any): string[] => {
  if (Array.isArray(role.highlights)) return role.highlights
  if (typeof role.highlights === 'string') return role.highlights.split('\n').filter((line: string) => line.trim() !== '')
  return []
}

export default function PublicServiceRolesSection() {
  const { content } = useSiteContent()
  const section = content?.sections['public-service']
  const roles = Array.isArray(section?.metadata?.roles) && section.metadata.roles.length > 0
    ? section.metadata.roles
    : fallbackRoles

  const rolesEyebrow = (section?.metadata?.rolesEyebrow as string) || 'Policy &amp; Leadership'
  const rolesTitle = (section?.metadata?.rolesTitle as string) || 'Active roles in national federations and ministerial advisory boards'

  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
            <AnimatedSection>
              <h2 className="font-serif text-2xl lg:text-3xl font-light text-ink mb-4">
                {rolesEyebrow}
              </h2>
              <p className="text-sm font-light text-ink-mid leading-relaxed">
                {rolesTitle}
              </p>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-9">
            {roles.map((role, i) => (
              <AnimatedSection key={role.title} delay={i * 0.07}>
                <div className="py-7 border-b border-rule first:border-t">
                  <div className="flex items-start justify-between gap-6 mb-3">
                    <h3 className="font-serif text-lg font-light text-ink">{role.title}</h3>
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal shrink-0 pt-1">
                      {role.period}
                    </span>
                  </div>
                  <p className="text-sm font-light text-ink-mid leading-relaxed">
                    {role.description}
                  </p>
                  {/* Highlights if present */}
                  {getHighlights(role).length > 0 && (
                    <div className="mt-4 space-y-2">
                      {getHighlights(role).map((h: string, j: number) => (
                        <div key={j} className="flex items-start gap-3">
                          <span className="w-3 h-px bg-gold mt-2.5 shrink-0" />
                          <p className="text-sm font-light text-ink-muted leading-relaxed">{h}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
