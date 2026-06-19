import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Container } from '@/components/shared'
import { awards } from '@/data/awards'
import { cn } from '@/lib/utils'

const featuredAwards = awards

function GoldenFrame({
  children,
  isActive,
}: {
  children: React.ReactNode
  isActive: boolean
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          'relative transition-all duration-700 ease-out',
          isActive
            ? 'shadow-[0_0_50px_rgba(138,106,42,0.2),0_0_100px_rgba(138,106,42,0.08)]'
            : 'shadow-none'
        )}
      >
        <div
          className={cn(
            'relative transition-all duration-700 ease-out',
            isActive
              ? 'p-[3px] bg-gradient-to-br from-gold via-yellow-600 to-gold'
              : 'p-[1px] bg-white/10'
          )}
        >
          <div className={cn('bg-ink transition-all duration-700', isActive ? 'p-[3px]' : 'p-[2px]')}>
            {isActive && (
              <>
                <div className="absolute -top-[2px] -left-[2px] w-5 h-5 border-t-[2.5px] border-l-[2.5px] border-gold-light z-10" />
                <div className="absolute -top-[2px] -right-[2px] w-5 h-5 border-t-[2.5px] border-r-[2.5px] border-gold-light z-10" />
                <div className="absolute -bottom-[2px] -left-[2px] w-5 h-5 border-b-[2.5px] border-l-[2.5px] border-gold-light z-10" />
                <div className="absolute -bottom-[2px] -right-[2px] w-5 h-5 border-b-[2.5px] border-r-[2.5px] border-gold-light z-10" />
              </>
            )}
            {children}
          </div>
        </div>
      </div>
      {isActive && (
        <div className="absolute -inset-20 -z-10 pointer-events-none">
          <div className="w-full h-full rounded-full opacity-20 blur-[80px] bg-gold" />
        </div>
      )}
    </div>
  )
}

const cardWidth = 280
const gap = 40

export default function HomeAwards() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  const total = featuredAwards.length

  const goTo = useCallback((next: number) => {
    setActiveIndex(((next % total) + total) % total)
  }, [total])

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext])

  const activeAward = featuredAwards[activeIndex]

  useEffect(() => {
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext])

  if (!activeAward) return null

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-ink text-white relative overflow-hidden min-h-[700px]"
    >
      {/* ── Cinematic ambient lighting ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06] bg-gold blur-[120px] rounded-full" />
        {/* Bottom warm glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-[0.04] bg-teal blur-[100px] rounded-full" />
        {/* Left/right vignette */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-ink z-10 pointer-events-none" />
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, white 0.5px, transparent 0.5px), radial-gradient(circle at 75% 75%, white 0.5px, transparent 0.5px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Container className="relative z-10">
        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="section-header">
            <span className="section-tag text-gold tracking-[0.25em]">Recognition</span>
            <span className="section-rule !bg-white/10" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-white">
                Awards &amp; <em className="text-gold not-italic">honours</em>
              </h2>
              <p className="mt-2 text-sm font-light text-white/30 max-w-lg leading-relaxed">
                Distinctions that reflect a career of transformative leadership in healthcare.
              </p>
            </div>
            <Link
              to="/awards-recognition"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-gold transition-colors duration-300 shrink-0"
            >
              View All
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Carousel ── */}
        <div className="relative select-none">
          {/* Navigation arrows */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/60 transition-all duration-300 focus:outline-none"
            aria-label="Previous award"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/60 transition-all duration-300 focus:outline-none"
            aria-label="Next award"
          >
            <FaChevronRight size={16} />
          </button>

          {/* Carousel viewport */}
          <div className="relative mx-auto" style={{ height: 440, maxWidth: 900 }}>
            {featuredAwards.map((award, i) => {
              const diff = i - activeIndex
              const isVisible = Math.abs(diff) <= 1
              const isActive = diff === 0

              const xOffset = diff * (cardWidth + gap)

              return (
                <motion.div
                  key={award.id}
                  animate={{
                    x: xOffset,
                    scale: isActive ? 1 : 0.75,
                    opacity: isVisible ? (isActive ? 1 : 0.35) : 0,
                    zIndex: isActive ? 20 : 10 - Math.abs(diff),
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ width: cardWidth }}
                  onClick={() => !isActive && goTo(i)}
                >
                  <GoldenFrame isActive={isActive}>
                    <div className="overflow-hidden aspect-[3/4]">
                      <img
                        src={award.image}
                        alt={award.title}
                        className={cn(
                          'w-full h-full object-cover transition-all duration-700',
                          isActive ? '' : 'grayscale brightness-50'
                        )}
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/10 pointer-events-none" />
                      )}
                      {isActive && (
                        <span className="absolute bottom-3 right-3 font-serif text-2xl font-light text-white/20 leading-none select-none">
                          {award.year}
                        </span>
                      )}
                    </div>
                  </GoldenFrame>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── Biography panel ── */}
        <div className="max-w-2xl mx-auto text-center mt-10 md:mt-12 min-h-[160px] flex flex-col justify-center">
          <motion.div
            key={activeAward.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold">
                {activeAward.category}
              </span>
              <span className="w-6 h-px bg-gold/40" />
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40">
                {activeAward.year}
              </span>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-light text-white leading-snug mb-2">
              {activeAward.title}
            </h3>

            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-gold/70 mb-5">
              {activeAward.organization}
            </p>

            <p className="text-sm font-light text-white/50 leading-relaxed max-w-xl mx-auto">
              {activeAward.description}
            </p>
          </motion.div>
        </div>

        {/* ── Pagination dots ── */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {featuredAwards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all duration-500 focus:outline-none',
                i === activeIndex
                  ? 'w-8 h-[3px] bg-gold'
                  : 'w-[6px] h-[6px] bg-white/20 hover:bg-white/40'
              )}
              aria-label={`Go to award ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
