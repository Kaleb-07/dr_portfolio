import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  FaHospital,
  FaGraduationCap,
  FaFlask,
  FaMicroscope,
  FaMobileAlt,
  FaPiggyBank,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { Container } from '@/components/shared'
import { ecosystemNodes } from '@/data/ecosystem'

/* ── Icon per category ─────────────────────────────────────────────────── */
const categoryIcon: Record<string, IconType> = {
  hospital:       FaHospital,
  education:      FaGraduationCap,
  manufacturing:  FaFlask,
  research:       FaMicroscope,
  'digital-health': FaMobileAlt,
  insurance:      FaPiggyBank,
}

const preview = ecosystemNodes.slice(0, 6)

/* ── Single grid cell ─────────────────────────────────────────────────── */
function EcosystemCell({
  node,
  index,
}: {
  node: (typeof preview)[0]
  index: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon   = categoryIcon[node.category] ?? FaHospital
  const num    = String(index + 1).padStart(2, '0')
  const isRightCol = (index % 3) !== 2   // has right border
  const isTopRow   = index < 3            // has bottom border

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`
        group relative flex flex-col justify-between p-8 overflow-hidden cursor-default
        ${isTopRow   ? 'border-b border-rule' : ''}
        ${isRightCol ? 'border-r border-rule' : ''}
      `}
      style={{ minHeight: 220 }}
    >
      {/* ── hover background overlay ── */}
      <div
        className="
          absolute inset-0 pointer-events-none z-0
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500 ease-in-out
        "
        style={{
          background:
            'radial-gradient(ellipse at top left, var(--color-teal-light) 0%, var(--color-gold-light) 60%, transparent 100%)',
        }}
      />

      {/* number */}
      <span className="relative z-10 font-mono text-[11px] tracking-[0.18em] text-gold mb-4 block">
        {num}
      </span>

      {/* title + description */}
      <div className="relative z-10 flex-1">
        <h3 className="font-serif text-xl font-semibold text-ink mb-3 leading-snug">
          {node.name}
        </h3>
        <p className="text-sm leading-relaxed text-ink font-light">
          {node.description}
        </p>
      </div>

      {/* icon bottom */}
      <div className="relative z-10 mt-6">
        <Icon
          size={26}
          className="text-ink-faint transition-colors duration-300 group-hover:text-teal"
        />
      </div>
    </motion.div>
  )
}

/* ── Main section ──────────────────────────────────────────────────────── */
export default function HomeEcosystem() {
  const headerRef  = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section className="section-padding bg-paper">
      <Container>
        {/* ── Header row ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          {/* left: tag + heading */}
          <div>
            {/* Override global section-header bottom margin to tighten the gap */}
            <div className="section-header" style={{ marginBottom: 12 }}>
              <span className="section-tag font-bold">The Liyana Healthcare Framework</span>
              <span className="section-rule" />
            </div>
            <h2
              className="font-serif text-3xl md:text-4xl font-light text-ink leading-tight"
              style={{ maxWidth: '38rem' }}
            >
              A vertically integrated ecosystem{' '}
              <em className="not-italic text-teal-mid">for sovereignty and scale.</em>
            </h2>
          </div>

          {/* right: dashed explore button */}
          <Link
            to="/ecosystem"
            className="
              inline-flex items-center gap-2 self-start md:self-end
              px-5 py-2.5 text-xs font-mono tracking-widest uppercase text-ink
              border border-dashed border-ink-mid
              transition-all duration-300
              hover:border-teal hover:text-teal hover:bg-teal-light
            "
          >
            Explore Ecosystem
            <span className="text-base leading-none">→</span>
          </Link>
        </motion.div>

        {/* ── Bordered grid container ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="border border-rule grid grid-cols-1 md:grid-cols-3"
        >
          {preview.map((node, i) => (
            <EcosystemCell key={node.id} node={node} index={i} />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
