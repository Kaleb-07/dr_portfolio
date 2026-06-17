import { motion } from 'framer-motion'
import { Container } from '@/components/shared'

const quickFacts = [
  { label: 'VP, Ethiopian Healthcare Federation', value: '2023 – Present' },
  { label: 'Ministry of Health Advisory Roles', value: '4 Positions' },
  { label: 'Policy & Innovation Boards', value: 'Ongoing' },
]

export default function PublicServiceHero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 2 }}
          className="absolute -top-32 -left-24 w-[600px] h-[600px] rounded-full blur-[140px] bg-teal"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 2.4, delay: 0.3 }}
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] bg-gold-light"
        />
      </div>

      <Container className="relative z-10">
        {/* Tag */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[9px] tracking-[0.28em] uppercase text-teal mb-8"
        >
          Public Service &amp; Legacy
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-8 max-w-3xl"
        >
          Shaping the future of{' '}
          <em className="text-teal-mid not-italic">National Healthcare.</em>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-sm font-light text-white/60 leading-relaxed max-w-xl mb-16"
        >
          Bridging clinical excellence with high-level policy advisory, Dr. Liyana serves
          at the intersection of medical innovation and sovereign health infrastructure.
        </motion.p>

        {/* Quick facts strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="border-t border-white/10 pt-8 grid sm:grid-cols-3 gap-6"
        >
          {quickFacts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 + i * 0.07 }}
            >
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/35 mb-1">
                {fact.label}
              </p>
              <p className="text-sm font-light text-white/80">{fact.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
