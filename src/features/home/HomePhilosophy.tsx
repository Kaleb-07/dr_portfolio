import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Container } from '@/components/shared'
import { siteConfig } from '@/constants/site'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function HomePhilosophy() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const { content } = useSiteContent()
  const section = content?.sections.leadership_philosophy
  const quote = section?.description || siteConfig.philosophy.quote
  const label = section?.eyebrow || siteConfig.philosophy.label
  const attribution = section?.subtitle || siteConfig.philosophy.attribution

  // Prepare quote words for staggered anim
  const cleanQuote = quote.replace(/[“”"]/g, '')
  const words = cleanQuote.split(' ')

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }


  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-teal text-white text-center py-28"
    >
      {/* Premium ambient light backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.15, scale: 1.1 } : {}}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute -left-12 -top-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-[100px] bg-gold-light"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.1, scale: 1.1 } : {}}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
          className="absolute -right-12 -bottom-24 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[120px] bg-teal-light"
        />
      </div>

      <Container className="relative z-10 max-w-4xl mx-auto">
        {/* Animated tag */}
        <motion.p
          initial={{ opacity: 0, y: -10, letterSpacing: '0.12em' }}
          animate={isInView ? { opacity: 0.5, y: 0, letterSpacing: '0.2em' } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-mono text-[9px] uppercase text-white mb-10"
        >
          {label}
        </motion.p>

        {/* Animated blockquote */}
        <blockquote className="font-serif text-3xl lg:text-5xl font-light italic leading-tight max-w-4xl mx-auto px-4">
          <motion.span
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="inline"
          >
            <motion.span variants={wordVariants} className="inline-block mr-1 text-gold-light">&ldquo;</motion.span>
            {words.map((word, idx) => (
              <motion.span
                key={idx}
                variants={wordVariants}
                className="inline-block mr-2 lg:mr-3"
              >
                {word}
              </motion.span>
            ))}
            <motion.span variants={wordVariants} className="inline-block text-gold-light">&rdquo;</motion.span>
          </motion.span>
        </blockquote>

        {/* Animated attribution */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 0.6, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
          className="mt-10 text-sm font-light text-white/80 tracking-wide"
        >
          {attribution}
        </motion.p>
      </Container>
    </section>
  )
}
