import { useEffect, useMemo } from 'react'

import { AnimatedSection, Container, Card } from '@/components/shared'
import PageBanner from '@/components/layout/PageBanner'
import { publicServiceRoles, publicServiceDescription } from '@/data/public-service'
import { seoPages } from '@/lib/seo'
import type { PublicServiceRole } from '@/types'

const categoryConfig: Record<PublicServiceRole['category'], { label: string; description: string }> = {
  advisory: { label: 'Advisory Roles', description: 'Strategic advisory positions shaping national health policy.' },
  federation: { label: 'Federation Leadership', description: 'Leading continental healthcare federations.' },
  innovation: { label: 'Innovation Programs', description: 'Health systems resilience and innovation.' },
  policy: { label: 'Policy Impact', description: 'National and continental policy frameworks.' },
}

export default function PublicServicePage() {
  useEffect(() => {
    document.title = seoPages['public-service'].title
  }, [])

  const groupedRoles = useMemo(() => {
    const map: Record<string, PublicServiceRole[]> = { advisory: [], federation: [], innovation: [], policy: [] }
    for (const role of publicServiceRoles) {
      if (map[role.category]) map[role.category]!.push(role)
    }
    return map as Record<PublicServiceRole['category'], PublicServiceRole[]>
  }, [])

  const sections: { key: PublicServiceRole['category'] }[] = [
    { key: 'advisory' },
    { key: 'federation' },
    { key: 'innovation' },
    { key: 'policy' },
  ]

  return (
    <>
      <PageBanner
        title="Public Service"
        description={publicServiceDescription}
      />

      {sections.map(({ key }, sectionIndex) => {
        const roles = groupedRoles[key]
        if (!roles || roles.length === 0) return null
        const config = categoryConfig[key]

        return (
          <section
            key={key}
            className={`section-padding ${sectionIndex % 2 === 1 ? 'bg-paper-warm' : 'bg-paper'}`}
          >
            <Container>
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">{config.label}</span>
                  <span className="section-rule" />
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-4">{config.label}</h2>
                <p className="text-sm font-light text-ink-mid max-w-2xl mb-10">{config.description}</p>
              </AnimatedSection>
              <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role, i) => (
                  <AnimatedSection key={role.id} delay={i * 0.05}>
                    <Card className="bg-white border-l-2 border-teal pl-5 h-full">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-lg font-light text-ink">{role.title}</h3>
                        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold shrink-0 ml-4">
                          {role.period}
                        </span>
                      </div>
                      <p className="text-sm text-teal mb-2">{role.organization}</p>
                      <p className="text-sm font-light text-ink-mid leading-relaxed mb-4">{role.description}</p>
                      {role.highlights.length > 0 && (
                        <ul className="space-y-1.5">
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
      })}
    </>
  )
}
