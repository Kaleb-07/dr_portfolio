import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaTrophy, FaStar } from 'react-icons/fa'
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
            ? 'shadow-[0_0_50px_rgba(15,110,86,0.2),0_0_100px_rgba(15,110,86,0.08)]'
            : 'shadow-none'
        )}
      >
        <div
          className={cn(
            'relative transition-all duration-700 ease-out',
            isActive
              ? 'p-[2px] bg-gradient-to-br from-teal via-teal-mid to-teal'
              : 'p-[1px] bg-teal/20'
          )}
        >
          <div className={cn('bg-paper transition-all duration-700', isActive ? 'p-[2px]' : 'p-[1px]')}>
            {isActive && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="absolute -top-[2px] -left-[2px] w-5 h-5 border-t-[2.5px] border-l-[2.5px] border-teal z-10"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="absolute -top-[2px] -right-[2px] w-5 h-5 border-t-[2.5px] border-r-[2.5px] border-teal z-10"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="absolute -bottom-[2px] -left-[2px] w-5 h-5 border-b-[2.5px] border-l-[2.5px] border-teal z-10"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="absolute -bottom-[2px] -right-[2px] w-5 h-5 border-b-[2.5px] border-r-[2.5px] border-teal z-10"
                />
              </>
            )}
            {children}
          </div>
        </div>
      </div>
      {isActive && (
        <div className="absolute -inset-20 -z-10 pointer-events-none">
          <div className="w-full h-full rounded-full opacity-20 blur-[80px] bg-teal" />
        </div>
      )}
    </div>
  )
}

function TrophyAnimation({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`trophy-${index}`}
          initial={{ opacity: 0, scale: 0.8, y: 120, rotate: -20 }}
          animate={{ 
            opacity: [0, 0.6, 0.8, 0], 
            scale: [0.8, 2.0, 2.4, 3.2], 
            y: [120, 0, -60, -200], 
            rotate: [-20, 0, 15, 30] 
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3.5, times: [0, 0.3, 0.7, 1], ease: "easeOut" }}
          className="absolute z-0 text-gold/60 mix-blend-plus-lighter drop-shadow-[0_0_40px_rgba(255,215,0,0.4)]"
        >
          <FaTrophy size={320} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Fireworks({ index, count = 50 }: { index: number; count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360 + Math.random() * 30
      const rad = (angle * Math.PI) / 180
      const velocity = 120 + Math.random() * 250
      const size = 6 + Math.random() * 10
      const colors = ['bg-teal', 'bg-teal-mid', 'bg-teal-light', 'bg-gold', 'bg-gold-light']
      const shape = Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm'
      const isStar = Math.random() > 0.7
      return {
        id: i,
        rad,
        velocity,
        size,
        delay: Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape,
        isStar
      }
    })
  }, [index, count])

  return (
    <motion.div className="absolute inset-0 pointer-events-none" key={`${index}-${count}`}>
      {particles.map((p) => {
        const xDistance = Math.cos(p.rad) * p.velocity
        const yDistance = Math.sin(p.rad) * p.velocity - 80 // Upward burst bias
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: "-50%", y: "-50%", scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: ["-50%", `calc(-50% + ${xDistance * 0.8}px)`, `calc(-50% + ${xDistance}px)`],
              y: ["-50%", `calc(-50% + ${yDistance}px)`, `calc(-50% + ${yDistance + 180}px)`],
              scale: [0, 1, Math.random() * 0.5 + 0.8, 0],
              rotate: 180 + Math.random() * 360,
            }}
            transition={{
              duration: 2.0 + Math.random(),
              delay: p.delay,
              times: [0, 0.2, 0.7, 1],
              ease: "easeOut",
            }}
            className={cn(
              `absolute top-1/2 left-1/2 flex items-center justify-center ${p.shape}`,
              !p.isStar ? `${p.color} shadow-[0_0_12px_currentColor]` : 'text-gold drop-shadow-[0_0_16px_rgba(255,215,0,0.8)]'
            )}
            style={{ width: p.size, height: p.size }}
          >
            {p.isStar && <FaStar size={p.size * 2} className="drop-shadow-[0_0_12px_rgba(255,215,0,1)]" />}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

const cardWidth = 200
const gap = 28

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
      className="py-12 md:py-16 bg-paper text-ink relative overflow-hidden"
    >
      {/* ── Cinematic ambient lighting ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top spotlight — boosted */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] opacity-20 bg-teal blur-[100px] rounded-full" />
        {/* Bottom warm glow — boosted */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] opacity-15 bg-gold blur-[90px] rounded-full" />
        {/* Left/right vignette */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-paper z-10 pointer-events-none" />

        {/* ── Ripple ring 1 — brighter ── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`r1-${activeIndex}`}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.5, scale: 2.8 }}
            exit={{ opacity: 0, scale: 3.2 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border-2 border-teal/70 pointer-events-none"
          />
        </AnimatePresence>

        {/* ── Ripple ring 2 — brighter ── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`r2-${activeIndex}`}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 0.35, scale: 4.0 }}
            exit={{ opacity: 0, scale: 4.5 }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border-2 border-gold/50 pointer-events-none"
          />
        </AnimatePresence>

        {/* ── Ripple ring 3 — new outer ring ── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`r3-${activeIndex}`}
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 0.2, scale: 5.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0, ease: 'easeOut', delay: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-teal/30 pointer-events-none"
          />
        </AnimatePresence>

        {/* Floating orbs — more visible */}
        <motion.div
          key={`orb1-${activeIndex}`}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 0.25, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-16 left-[15%] w-28 h-28 rounded-full bg-teal blur-[50px] pointer-events-none"
        />
        <motion.div
          key={`orb2-${activeIndex}`}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 0.25, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-20 right-[12%] w-32 h-32 rounded-full bg-gold blur-[60px] pointer-events-none"
        />

        {/* Center flash burst on award change */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`flash-${activeIndex}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', times: [0, 0.2, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full blur-[50px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(15, 110, 86, 0.25) 50%, transparent 75%)',
            }}
          />
        </AnimatePresence>

        {/* Trophy Animation */}
        <TrophyAnimation index={activeIndex} />

        {/* Firework particle burst — center */}
        <Fireworks key={`c-${activeIndex}`} index={activeIndex} count={64} />

        {/* Firework particle burst — left side */}
        <div className="absolute left-0 top-0 w-1/4 h-full">
          <Fireworks key={`l-${activeIndex}`} index={activeIndex} count={32} />
        </div>

        {/* Firework particle burst — right side */}
        <div className="absolute right-0 top-0 w-1/4 h-full">
          <Fireworks key={`r-${activeIndex}`} index={activeIndex} count={32} />
        </div>

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(0,0,0,0.3) 0.5px, transparent 0.5px), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.3) 0.5px, transparent 0.5px)',
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
          className="mb-6 md:mb-8"
        >
          <div className="section-header">
            <span className="section-tag text-teal tracking-[0.25em]">Recognition</span>
            <span className="section-rule" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-ink">
                Awards &amp; <em className="text-teal not-italic">honours</em>
              </h2>
              <p className="mt-2 text-sm font-light text-ink-muted max-w-lg">
                Distinctions that reflect a career of transformative leadership in healthcare.
              </p>
            </div>
            <Link
              to="/awards-recognition"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-ink-faint hover:text-teal-mid transition-colors duration-300 shrink-0"
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full border border-teal/30 text-teal hover:bg-teal/10 hover:border-teal/60 transition-all duration-300 focus:outline-none"
            aria-label="Previous award"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full border border-teal/30 text-teal hover:bg-teal/10 hover:border-teal/60 transition-all duration-300 focus:outline-none"
            aria-label="Next award"
          >
            <FaChevronRight size={16} />
          </button>

          {/* Carousel viewport */}
          <div className="relative mx-auto" style={{ height: 300, maxWidth: 700 }}>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-paper/60 via-transparent to-paper/10 pointer-events-none" />
                      )}
                      {isActive && (
                        <span className="absolute bottom-3 right-3 font-serif text-3xl font-light text-ink-faint/40 leading-none select-none">
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
        <div className="max-w-2xl mx-auto text-center mt-4 min-h-[100px] flex flex-col justify-center">
          <motion.div
            key={activeAward.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-teal">
                {activeAward.category}
              </span>
              <span className="w-8 h-px bg-teal/40" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-ink-faint">
                {activeAward.year}
              </span>
            </div>

            <h3 className="font-serif text-xl md:text-2xl font-light text-ink leading-snug mb-2">
              {activeAward.title}
            </h3>

            <p className="font-mono text-xs tracking-[0.2em] uppercase text-teal/70 mb-3">
              {activeAward.organization}
            </p>

            <p className="text-base font-light text-ink-muted leading-relaxed max-w-xl mx-auto">
              {activeAward.description}
            </p>
          </motion.div>
        </div>

        {/* ── Pagination dots ── */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {featuredAwards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all duration-500 focus:outline-none',
                i === activeIndex
                  ? 'w-8 h-[3px] bg-teal'
                  : 'w-[6px] h-[6px] bg-ink-faint/50 hover:bg-ink-muted/60'
              )}
              aria-label={`Go to award ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
