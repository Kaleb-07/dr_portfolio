import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGraduationCap, FaBriefcase, FaStar } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { Container } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { TimelineEvent } from '@/services/cms'

/* ── Icon map per category ─────────────────────────────────────────────── */
const categoryIcon: Record<string, IconType> = {
  education: FaGraduationCap,
  career:    FaBriefcase,
  milestone: FaStar,
}

const categoryLabel: Record<string, string> = {
  education: 'Education',
  career:    'Career',
  milestone: 'Milestone',
}

/* ── Palette ───────────────────────────────────────────────────────────── */
interface Palette { bg: string; iconBg: string }

const PALETTES: Palette[] = [
  { bg: 'from-[#0F6E56] to-[#1D9E75]', iconBg: '#0F6E56' },
  { bg: 'from-[#8A6A2A] to-[#b89040]', iconBg: '#8A6A2A' },
  { bg: 'from-[#065f46] to-[#0F6E56]', iconBg: '#065f46' },
  { bg: 'from-[#b45309] to-[#d97706]', iconBg: '#b45309' },
  { bg: 'from-[#1D9E75] to-[#0e7490]', iconBg: '#1D9E75' },
  { bg: 'from-[#44403c] to-[#1c1917]', iconBg: '#44403c' },
  { bg: 'from-[#8A6A2A] to-[#0F6E56]', iconBg: '#8A6A2A' },
]

/* ── Individual bubble card ────────────────────────────────────────────── */
function BubbleCard({
  item,
  index,
  isLast,
  totalItems,
}: {
  item: TimelineEvent
  index: number
  isLast: boolean
  totalItems: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const palette  = PALETTES[index % PALETTES.length]!
  const IconComp = categoryIcon[item.category] ?? FaStar
  const delay    = index * 0.12

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56, scale: 0.86 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center"
      style={{ minWidth: 'min(160px, 42vw)' }}
    >
      {/* ── Icon node ── */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.35, delay: delay + 0.08, type: 'spring', stiffness: 280 }}
        className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-white/60"
        style={{ background: palette.iconBg }}
      >
        <IconComp className="text-white" size={18} />
      </motion.div>

      {/* ── Dashed connector ── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.35, delay: delay + 0.2 }}
        className="w-px h-7 origin-top"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${palette.iconBg} 0 4px, transparent 4px 8px)`,
        }}
      />

      {/* ── Big circle bubble ── */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 1.5 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className={`
          relative w-36 h-36 sm:w-44 sm:h-44 rounded-full
          bg-gradient-to-br ${palette.bg}
          shadow-2xl flex flex-col items-center justify-center
          text-center px-4 cursor-default select-none
          ${isLast ? '' : '-mr-5'}
        `}
        style={{ zIndex: totalItems - index }}
      >
        {/* inner glow ring */}
        <div className="absolute inset-2 rounded-full border border-white/15 pointer-events-none" />

        {/* year */}
        <span className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-white/70 mb-1">
          {item.year}
        </span>

        {/* title */}
        <h3 className="font-serif text-[0.75rem] font-semibold leading-tight text-white">
          {item.title}
        </h3>

        {/* subtitle */}
        {item.subtitle && (
          <p className="mt-1 text-[0.58rem] leading-snug text-white/70">
            {item.subtitle}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ── Main section ──────────────────────────────────────────────────────── */
export default function HomeTimeline() {
  const headerRef  = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const { content } = useSiteContent()
  const timeline = content?.timelineEvents || []

  if (timeline.length === 0) return null

  return (
    <section className="section-padding bg-paper-warm">
      <Container>
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-header">
            <span className="section-tag">Career Timeline</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-14">
            From medical student to{' '}
            <em className="text-teal-mid not-italic">system architect</em>
          </h2>
        </motion.div>

        {/* Bubble row — wraps on small screens, centred on large */}
        <div className="relative">
          {/* Horizontal dashed rail */}
          <div
            className="absolute left-0 right-0 pointer-events-none hidden md:block"
            style={{ top: 44 + 28, height: 1 }}
          >
            <div
              className="h-px w-full"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, var(--color-teal) 0 6px, transparent 6px 14px)',
                opacity: 0.2,
              }}
            />
          </div>

          {/* No scroll — flex-wrap centres everything */}
          <div className="flex flex-wrap items-start justify-center gap-y-8 gap-x-0">
            {timeline.map((item, i) => (
              <BubbleCard
                key={item.id}
                item={item}
                index={i}
                isLast={i === timeline.length - 1}
                totalItems={timeline.length}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap gap-6 justify-center"
        >
          {Object.entries(categoryIcon).map(([cat, Icon]) => (
            <div
              key={cat}
              className="flex items-center gap-2 text-ink-muted text-xs uppercase tracking-widest font-mono"
            >
              <Icon size={13} className="text-teal" />
              <span>{categoryLabel[cat]}</span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
