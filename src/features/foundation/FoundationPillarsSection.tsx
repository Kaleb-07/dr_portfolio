import { motion } from 'framer-motion'
import { Container, AnimatedSection } from '@/components/shared'
import { foundationPillars } from '@/data/foundation'
import { useSiteContent } from '@/hooks/useSiteContent'
import {
  HeartPulse,
  GraduationCap,
  Hospital,
  Handshake,
  Landmark,
  Sparkles,
  Microscope,
} from 'lucide-react'

const iconMap = {
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  hospital: Hospital,
  handshake: Handshake,
  landmark: Landmark,
  sparkles: Sparkles,
  microscope: Microscope,
}

type Pillar = {
  id?: string | number
  title?: string | null
  body?: string | null
  eyebrow?: string | null
  metadata?: Record<string, unknown>
}

export default function FoundationPillarsSection() {
  const { content } = useSiteContent()
  const section = content?.sections.foundation_story || content?.sections.foundation

  const cmsPillars = Array.isArray(section?.blocks)
    ? section.blocks.map((block) => block as Pillar)
    : []
  const pillars = cmsPillars.length > 0 ? cmsPillars : foundationPillars

  return (
    <section className="section-padding bg-paper-warm relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -left-16 bottom-0 w-[320px] h-[320px] rounded-full blur-[90px] bg-teal-light" />
      </div>

      <Container className="relative z-10">
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Foundation Pillars</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-14">
            The pillars behind the <em className="text-teal-mid not-italic">mission</em>
          </h2>
        </AnimatedSection>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar: Pillar, index: number) => {
            const iconValue = String(pillar.metadata?.icon || '')
            const Icon = iconMap[iconValue as keyof typeof iconMap] || Sparkles

            return (
              <AnimatedSection
                key={String(pillar.id ?? pillar.title ?? index)}
                delay={index * 0.06}
              >
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="group h-full rounded-2xl border border-rule bg-white p-6 shadow-sm transition-all hover:border-teal/40 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-light text-teal transition-transform duration-300 group-hover:scale-105">
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink-muted">
                      Pillar
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-ink mb-3">
                    {pillar.title || 'Untitled Pillar'}
                  </h3>

                  <p className="text-sm font-light leading-relaxed text-ink-mid">
                    {pillar.body ||
                      pillar.eyebrow ||
                      'Strategic support for the foundation mission.'}
                  </p>
                </motion.article>
              </AnimatedSection>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
