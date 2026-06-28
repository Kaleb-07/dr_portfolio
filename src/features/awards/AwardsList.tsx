import { useMemo } from 'react'
import { AnimatedSection, Container } from '@/components/shared'
import { awards } from '@/data/awards'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { Award } from '@/types'

const categoryLabels: Record<Award['category'], string> = {
  professional: 'Professional Excellence',
  alumni: 'Alumni Recognition',
  industry: 'Industry Honours',
  leadership: 'Leadership Awards',
}

const categoryKeys: Award['category'][] = ['professional', 'alumni', 'industry', 'leadership']

interface SectionMeta {
  sectionEyebrow?: string
  sectionTitle?: string
  sectionDescription?: string
}

export default function AwardsList() {
  const { content } = useSiteContent()
  const section = content?.sections?.recognition_awards

  const meta = (section?.metadata ?? {}) as SectionMeta
  const sectionEyebrow = meta.sectionEyebrow || 'Awards & Recognition'
  const sectionTitle = meta.sectionTitle || 'Honours that reflect a life of impact'
  const sectionDescription =
    meta.sectionDescription ||
    'Recognition from institutions and peers for sustained excellence in healthcare leadership, service, and innovation.'

  const groupedAwards = useMemo(() => {
    const cmsAwards =
      section?.blocks?.map((block) => ({
        id: String(block.id),
        title: block.title || '',
        organization: String(block.metadata?.organization || ''),
        year: Number(block.metadata?.year || new Date().getFullYear()),
        description: block.body || '',
        image: block.image_url || '/image.png',
        category: String(block.metadata?.category || 'professional') as Award['category'],
      })) || []

    const groups: Record<string, Award[]> = {
      professional: [],
      alumni: [],
      industry: [],
      leadership: [],
    }
    const sourceAwards = cmsAwards.length ? cmsAwards : awards
    for (const award of sourceAwards) {
      if (groups[award.category]) groups[award.category]!.push(award)
    }
    return groups
  }, [section])

  return (
    <section className="section-padding bg-paper relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] rounded-full blur-[80px] bg-gold-light" />
      </div>

      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">{sectionEyebrow}</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
            {sectionTitle.includes('<em') ? (
              <span dangerouslySetInnerHTML={{ __html: sectionTitle }} />
            ) : (
              sectionTitle
            )}
          </h2>
          <p className="text-sm font-light text-ink-mid leading-relaxed max-w-xl mb-12">
            {sectionDescription}
          </p>
        </AnimatedSection>

        <div className="space-y-16">
          {categoryKeys.map((category, sectionIndex) => {
            const items = groupedAwards[category]
            if (!items || items.length === 0) return null

            return (
              <AnimatedSection key={category} delay={sectionIndex * 0.1}>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold">
                    {String(sectionIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal">
                    {categoryLabels[category]}
                  </span>
                  <div className="h-px flex-1 bg-rule" />
                </div>

                <div className="border-t border-rule divide-y divide-rule">
                  {items.map((award, i) => (
                    <AnimatedSection key={award.id} delay={i * 0.08}>
                      <div className="py-8 md:py-10 grid md:grid-cols-12 gap-6 items-start group hover:bg-paper-warm/40 px-4 transition-colors duration-300">
                        <div className="md:col-span-7">
                          <h3 className="font-serif text-xl font-light text-ink mb-1 group-hover:text-teal transition-colors duration-300">
                            {award.title}
                          </h3>
                          <p className="font-mono text-[9px] tracking-widest uppercase text-teal-mid mb-3">
                            {award.organization}
                          </p>
                          <p className="text-sm font-light text-ink-mid leading-relaxed">
                            {award.description}
                          </p>
                        </div>
                        <div className="md:col-span-5 flex md:justify-end items-start gap-4">
                          <span className="badge-gold">{categoryLabels[category]}</span>
                          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-muted shrink-0">
                            {award.year}
                          </span>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
