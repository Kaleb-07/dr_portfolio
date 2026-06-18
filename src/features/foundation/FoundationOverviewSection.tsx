import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '@/components/shared'
import { foundationOverview } from '@/data/foundation'

const stats = [
  { value: '5+', label: 'Impact Pillars' },
  { value: '4',  label: 'Board Chairmanships' },
  { value: '1',  label: 'CSO Board Chair' },
  { value: '1000+', label: 'Lives Impacted' },
]

function StatBlock({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden border border-rule bg-white p-8 text-center hover-sweep cursor-default"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
        className="relative z-10 font-serif text-4xl font-light text-teal mb-2"
      >
        {stat.value}
      </motion.p>
      <p className="relative z-10 font-mono text-xs tracking-widest uppercase text-ink-muted leading-snug">
        {stat.label}
      </p>
      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.45 + index * 0.08 }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal to-teal-mid origin-left"
      />
    </motion.div>
  )
}

export default function FoundationOverviewSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })
  const leftRef = useRef<HTMLDivElement>(null)
  const leftInView = useInView(leftRef, { once: true, margin: '-60px' })

  return (
    <section className="section-padding bg-paper relative overflow-hidden">
      {/* Ambient accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -left-24 top-1/4 w-96 h-96 rounded-full blur-[70px] bg-teal-light" />
      </div>

      <Container className="relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="section-header"
        >
          <span className="section-tag">Foundation</span>
          <span className="section-rule" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: heading + vision + mission */}
          <div ref={leftRef}>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="font-serif text-4xl md:text-5xl font-light text-ink mb-6"
            >
              The <em className="text-teal-mid not-italic">LUCS</em> Foundation
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-sm font-light text-ink-mid leading-relaxed mb-10"
            >
              {foundationOverview.description}
            </motion.p>

            {/* Vision block */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={leftInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="border-l-2 border-teal pl-6 mb-8"
            >
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-2">Vision</p>
              <p className="text-sm font-light text-ink-mid leading-relaxed">{foundationOverview.vision}</p>
            </motion.div>

            {/* Mission block */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={leftInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="border-l-2 border-gold pl-6"
            >
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-2">Mission</p>
              <p className="text-sm font-light text-ink-mid leading-relaxed">{foundationOverview.mission}</p>
            </motion.div>
          </div>

          {/* Right: stat grid */}
          <div className="grid grid-cols-2 gap-4 content-start">
            {stats.map((stat, i) => (
              <StatBlock key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
