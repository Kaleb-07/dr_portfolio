import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '@/components/shared'
import { futureVision } from '@/data/foundation'

export default function FoundationFutureSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 bg-gradient-to-br from-[#0a3d2c] via-teal to-[#0b4e3d] text-white"
    >
      {/* Layered ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 0.18, scale: 1.2 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'var(--color-gold-light)', filter: 'blur(120px)' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 0.12, scale: 1 } : {}}
          transition={{ duration: 2.5, ease: 'easeOut', delay: 0.3 }}
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: 'var(--color-teal-light)', filter: 'blur(100px)' }}
        />
      </div>

      <Container className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative border border-white/10 p-12 md:p-16 bg-white/5 backdrop-blur-[3px] shadow-2xl text-center"
        >
          {/* Corner ornaments */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white/25" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white/25" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-white/25" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-white/25" />

          {/* Section tag */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 mb-6"
          >
            Future Vision
          </motion.p>

          {/* Decorative separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-8"
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-serif text-4xl md:text-5xl font-light text-white mb-8"
          >
            Looking <em className="italic">ahead</em>
          </motion.h2>

          {/* Background decorative quote */}
          <span className="absolute top-8 left-8 font-serif text-[8rem] leading-none text-white/4 pointer-events-none select-none">
            &ldquo;
          </span>

          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="relative z-10 font-serif text-lg md:text-xl italic font-light text-white/85 leading-relaxed max-w-2xl mx-auto"
          >
            &ldquo;{futureVision}&rdquo;
          </motion.blockquote>

          {/* Bottom ornamental separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-10"
          />
        </motion.div>
      </Container>
    </section>
  )
}
