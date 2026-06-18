import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '@/components/shared'

const QUOTE =
  'Healthcare is not a service to be bought, but a system to be built. Only through complete vertical integration can we guarantee the quality of care and the dignity of the patient.'

export default function EcosystemVisionSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const words = QUOTE.split(' ')

  return (
    <section ref={ref} className="relative overflow-hidden bg-teal py-10 lg:py-14 text-center">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.15, scale: 1.1 } : {}}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute -left-12 -top-24 w-[400px] h-[400px] rounded-full blur-[100px] bg-gold-light"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.1, scale: 1.1 } : {}}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
          className="absolute -right-12 -bottom-24 w-[500px] h-[500px] rounded-full blur-[120px] bg-teal-light"
        />
      </div>

      <Container className="relative z-10 max-w-4xl mx-auto">
        {/* Decorative oversized quote mark — uses global --text-8xl / --text-9xl */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 0.15, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-8xl lg:text-9xl leading-none font-light text-gold-light select-none -mb-4"
          aria-hidden
        >
          99
        </motion.p>

        {/* Quote — word-by-word reveal */}
        <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light italic text-white leading-snug px-4">
          <motion.span
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.025 } } }}
            className="inline"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </blockquote>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <span className="w-10 h-px bg-gold-light" />
          <p className="font-mono text-xs tracking-[0.28em] uppercase text-white/50">
            Dr. Liyana, Founder
          </p>
          <span className="w-10 h-px bg-gold-light" />
        </motion.div>
      </Container>
    </section>
  )
}
