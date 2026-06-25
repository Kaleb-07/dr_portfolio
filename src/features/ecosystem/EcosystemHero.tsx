import { motion } from 'framer-motion'
import { Container } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function EcosystemHero() {
  const { content } = useSiteContent()
  const section = content?.sections.liyana_framework
  const ecosystemMeta = (section?.metadata?.ecosystem || {}) as {
    hero?: {
      tag?: string
      title?: string
      description?: string
      meta?: Array<{ value: string; label: string }>
    }
  }
  const meta =
    ecosystemMeta.hero?.meta && ecosystemMeta.hero.meta.length > 0
      ? ecosystemMeta.hero.meta
      : [
          { value: '6', label: 'Integrated Sectors' },
          { value: '1000+', label: 'Employees' },
          { value: '2010', label: 'Established' },
          { value: 'Pan-African', label: 'Reach' },
        ]

  return (
    <section className="bg-paper-warm relative overflow-hidden pt-20 pb-10 lg:pt-24 lg:pb-12 border-b border-rule">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1.1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute -right-20 top-0 w-[400px] h-[400px] rounded-full blur-[100px] bg-teal-light"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut', delay: 0.3 }}
          className="absolute -left-20 bottom-0 w-[350px] h-[350px] rounded-full blur-[90px] bg-gold-light"
        />
      </div>

      <Container className="relative z-10">
        {/* Section tag row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-5 mb-5"
        >
          <span className="section-tag">{ecosystemMeta.hero?.tag || 'Strategic Infrastructure'}</span>
          <span className="section-rule" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-ink leading-[1.1] mb-5 max-w-3xl"
        >
          {ecosystemMeta.hero?.title || 'Most investors build one piece… He built the entire chain.'}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm font-light text-ink-mid leading-relaxed max-w-xl mb-8"
        >
          {ecosystemMeta.hero?.description ||
            'Liyana Healthcare represents a paradigm shift in medical economics. By vertically integrating every touchpoint of the patient journey — from pharmaceutical manufacturing to primary delivery — we have eliminated the friction that stalls progress in emerging markets.'}
        </motion.p>

        {/* Meta stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 border border-rule divide-x divide-y sm:divide-y-0 divide-rule"
        >
          {meta.map((m) => (
            <div key={m.label} className="bg-white/60 px-6 py-5">
              <p className="font-serif text-2xl font-light text-teal mb-1">{m.value}</p>
              <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted">{m.label}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
