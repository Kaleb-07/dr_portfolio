import { useMemo } from 'react'
import { AnimatedSection, Container } from '@/components/shared'
import { awards } from '@/data/awards'
import type { Award } from '@/types'

const categoryLabels: Record<Award['category'], string> = {
  professional: 'Professional Excellence',
  alumni: 'Alumni Recognition',
  industry: 'Industry Honours',
  leadership: 'Leadership Awards',
}

const categoryKeys: Award['category'][] = ['professional', 'alumni', 'industry', 'leadership']

export default function AwardsList() {
  const groupedAwards = useMemo(() => {
    const groups: Record<string, Award[]> = { professional: [], alumni: [], industry: [], leadership: [] }
    for (const award of awards) {
      if (groups[award.category]) groups[award.category]!.push(award)
    }
    return groups
  }, [])

  return (
    <section className="bg-ink text-white">
      {categoryKeys.map((category, sectionIndex) => {
        const items = groupedAwards[category]
        if (!items || items.length === 0) return null

        return (
          <div key={category} className={sectionIndex > 0 ? 'border-t border-white/10' : ''}>
            <div className="section-padding">
              <Container>
                <AnimatedSection>
                  <div className="section-header">
                    <span className="section-tag text-teal">{categoryLabels[category]}</span>
                    <span className="section-rule !bg-white/20" />
                  </div>
                </AnimatedSection>
                <div className="grid md:grid-cols-2 gap-6 mt-10">
                  {items.map((award, i) => (
                    <AnimatedSection key={award.id} delay={i * 0.1}>
                      <div className="p-6 border border-white/10 h-full">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif text-lg font-light text-white mb-1">{award.title}</h3>
                            <p className="text-sm text-teal-mid mb-2">{award.organization}</p>
                            <p className="text-sm font-light text-white/60 leading-relaxed">{award.description}</p>
                          </div>
                          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold shrink-0">
                            {award.year}
                          </span>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </Container>
            </div>
          </div>
        )
      })}
    </section>
  )
}
