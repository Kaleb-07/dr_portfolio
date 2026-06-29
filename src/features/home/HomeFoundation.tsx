import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { FaHeartbeat, FaGraduationCap, FaHospital, FaHandshake } from 'react-icons/fa'
import { Container } from '@/components/shared'
import { foundationOverview } from '@/data/foundation'
import { useSiteContent } from '@/hooks/useSiteContent'
import { mapCmsHtml } from '@/lib/html'

/* ── Data ──────────────────────────────────────────────────────────────── */
const stats = [
  { value: '5+', label: 'Community Impact Pillars' },
  { value: '4', label: 'Board Chairmanships' },
  { value: '1', label: 'CSO Board Chairmanship' },
  { value: '1000+', label: 'Lives Impacted' },
]

const pillars = [
  { label: 'Community Health', icon: FaHeartbeat },
  { label: 'Education Access', icon: FaGraduationCap },
  { label: 'Healthcare Infrastructure', icon: FaHospital },
  { label: 'Professional Mentorship', icon: FaHandshake },
]

const iconMap = {
  'heart-pulse': FaHeartbeat,
  'graduation-cap': FaGraduationCap,
  hospital: FaHospital,
  handshake: FaHandshake,
}

/* ── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="group relative overflow-hidden bg-white border border-rule p-6 text-center cursor-default"
    >
      {/* hover background sweep */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at bottom right, var(--color-teal-light) 0%, var(--color-gold-light) 70%, transparent 100%)',
        }}
      />

      {/* number */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
        className="relative z-10 font-serif text-4xl font-light text-teal mb-2"
      >
        {stat.value}
      </motion.p>

      {/* label */}
      <p className="relative z-10 text-xs font-mono tracking-widest uppercase text-ink-muted leading-snug">
        {stat.label}
      </p>

      {/* bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.45 + index * 0.08 }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal to-teal-mid origin-left"
      />
    </motion.div>
  )
}

/* ── Main section ──────────────────────────────────────────────────────── */
export default function HomeFoundation() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  const leftRef = useRef<HTMLDivElement>(null)
  const leftInView = useInView(leftRef, { once: true, margin: '-60px' })
  const { content } = useSiteContent()
  const section = content?.sections.home_foundation
  const cmsStats = section?.metadata?.stats
  const displayedStats = Array.isArray(cmsStats) && cmsStats.length > 0 ? cmsStats : stats
  const displayedPillars = section?.blocks?.length
    ? section.blocks.map((block) => ({
        label: block.title || '',
        icon: iconMap[String(block.metadata?.icon || '') as keyof typeof iconMap] || FaHandshake,
      }))
    : pillars

  return (
    <section className="section-padding bg-paper-warm overflow-hidden">
      <Container>
        {/* ── Section tag ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="section-header mb-12"
        >
          <span className="section-tag">{section?.eyebrow || 'Foundation'}</span>
          <span className="section-rule" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Left: heading + description + pillars ── */}
          <div ref={leftRef}>
            {/* Decorative accent blob */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={leftInView ? { opacity: 0.07, scale: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute -left-24 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'var(--color-teal)', filter: 'blur(60px)', zIndex: 0 }}
            />

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 font-serif text-4xl md:text-5xl font-light text-ink mb-6"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: mapCmsHtml(
                    section?.title ||
                      'The <em class="text-teal-mid not-italic">LUCS Foundation</em>',
                  ),
                }}
              />
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 text-sm font-light text-ink-mid leading-relaxed mb-10"
            >
              {section?.description || foundationOverview.description}
            </motion.p>

            {/* Pillar list */}
            <div className="relative z-10 space-y-4">
              {displayedPillars.map(({ label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={leftInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-center gap-4"
                >
                  {/* animated line */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={leftInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
                    className="w-8 h-[1.5px] bg-teal shrink-0 origin-left"
                  />
                  <Icon
                    size={14}
                    className="text-teal shrink-0 transition-transform duration-300 group-hover:scale-125"
                  />
                  <span className="text-sm font-light text-ink-mid group-hover:text-ink transition-colors duration-200">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="mt-10"
            >
              <Link
                to="/foundation"
                className="
                  inline-flex items-center gap-2
                  px-5 py-2.5 text-xs font-mono tracking-widest uppercase text-ink
                  border border-dashed border-ink-mid
                  transition-all duration-300
                  hover:border-teal hover:text-teal hover:bg-teal-light
                "
              >
                Explore Foundation
                <span className="text-base leading-none">→</span>
              </Link>
            </motion.div>
          </div>

          {/* ── Right: 2×2 stat grid ── */}
          <div className="grid grid-cols-2 gap-4 content-start">
            {displayedStats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
