import { motion } from 'framer-motion'
import { Container } from '@/components/shared'

export default function EcosystemHero() {
  return (
    <section className="bg-paper pt-32 pb-20 lg:pt-40 lg:pb-28">
      <Container>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[9px] tracking-[0.28em] uppercase text-teal mb-6"
        >
          Strategic Infrastructure
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-ink leading-[1.1] mb-8 max-w-3xl"
        >
          Most investors build one piece…{' '}
          <em className="text-teal-mid italic">He built the entire chain.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm font-light text-ink-mid leading-relaxed max-w-xl"
        >
          Liyana Healthcare represents a paradigm shift in medical economics. By
          vertically integrating every touchpoint of the patient journey — from
          pharmaceutical manufacturing to primary delivery — we have eliminated the
          friction that stalls progress in emerging markets.
        </motion.p>
      </Container>
    </section>
  )
}
