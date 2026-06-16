import { useEffect, useMemo } from 'react'

import { AnimatedSection, Container, Button, Card } from '@/components/shared'
import PageBanner from '@/components/layout/PageBanner'
import EcosystemMap from '@/components/shared/EcosystemMap'
import { ecosystemNodes, ecosystemConnections, ecosystemTitle, ecosystemDescription } from '@/data/ecosystem'
import { seoPages } from '@/lib/seo'
import { cn } from '@/lib/utils'
import type { EcosystemCategory } from '@/types'

const categoryMeta: Record<EcosystemCategory, { label: string; description: string }> = {
  hospital: { label: 'Hospital & Clinical Services', description: 'Tertiary and specialty care facilities.' },
  diagnostics: { label: 'Diagnostics & Laboratory', description: 'Advanced diagnostic centers.' },
  education: { label: 'Education & Training', description: 'Medical professional training and leadership programs.' },
  research: { label: 'Research & Innovation', description: 'Clinical research and evidence-based policy.' },
  manufacturing: { label: 'Pharmaceutical Manufacturing', description: 'Local drug production for health security.' },
  'digital-health': { label: 'Digital Health', description: 'Telemedicine and digital platforms.' },
  insurance: { label: 'Health Insurance', description: 'Community-based insurance and financing.' },
  'community-services': { label: 'Community Services', description: 'Philanthropic programs for underserved communities.' },
}

const categoryKeys: EcosystemCategory[] = [
  'hospital', 'diagnostics', 'education', 'research', 'manufacturing', 'digital-health', 'insurance', 'community-services',
]

export default function EcosystemPage() {
  useEffect(() => {
    document.title = seoPages.ecosystem.title
  }, [])

  const groupedNodes = useMemo(() => {
    const map = new Map<EcosystemCategory, typeof ecosystemNodes>()
    for (const node of ecosystemNodes) {
      const existing = map.get(node.category)
      if (existing) existing.push(node)
      else map.set(node.category, [node])
    }
    return map
  }, [])

  return (
    <>
      <PageBanner
        title={ecosystemTitle}
        description={ecosystemDescription}
      />

      {/* Ecosystem Map */}
      <section className="section-padding bg-paper">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Network</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              The <em className="text-teal-mid not-italic">ecosystem</em> map
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Card className="bg-white border border-rule overflow-hidden">
              <EcosystemMap nodes={ecosystemNodes} connections={ecosystemConnections} />
            </Card>
          </AnimatedSection>
        </Container>
      </section>

      {/* Category Breakdown */}
      <section className="section-padding bg-paper-warm">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Pillars</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              Category <em className="text-teal-mid not-italic">breakdown</em>
            </h2>
          </AnimatedSection>
          {categoryKeys.map((category, sectionIndex) => {
            const nodes = groupedNodes.get(category)
            if (!nodes || nodes.length === 0) return null
            const meta = categoryMeta[category]
            return (
              <div key={category} className={cn(sectionIndex > 0 && 'mt-16')}>
                <AnimatedSection delay={sectionIndex * 0.05}>
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl font-light text-ink mb-1">{meta.label}</h3>
                    <p className="text-sm font-light text-ink-mid">{meta.description}</p>
                  </div>
                </AnimatedSection>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nodes.map((node, i) => (
                    <AnimatedSection key={node.id} delay={i * 0.05}>
                      <Card className="bg-white border border-rule h-full">
                        <h4 className="font-serif text-lg font-light text-ink mb-2">{node.name}</h4>
                        <p className="text-sm font-light text-ink-mid leading-relaxed mb-3">{node.description}</p>
                        {node.metrics && node.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {node.metrics.map((m, j) => (
                              <span key={j} className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal bg-teal-light px-2 py-1">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </Card>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )
          })}
        </Container>
      </section>

      {/* Vision CTA */}
      <section className="section-padding bg-paper">
        <Container className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">Vision</p>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-6">
              Integrated healthcare for <em className="text-teal-mid not-italic">all</em>
            </h2>
            <p className="text-sm font-light text-ink-mid leading-relaxed max-w-2xl mx-auto mb-8">
              The vision is a fully integrated healthcare ecosystem where hospitals, diagnostics, education, research, manufacturing, digital health, insurance, and community services work in concert.
            </p>
            <Button variant="primary" size="lg" className="bg-teal text-white">
              Explore Leadership Journey
            </Button>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
