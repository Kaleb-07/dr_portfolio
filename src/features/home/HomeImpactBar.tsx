import { useEffect, useRef } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { impactMetrics } from '@/data/metrics'
import { Container } from '@/components/shared'
import { cn } from '@/lib/utils'

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const numeric = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
  const hasPlus = value.includes('+')

  useEffect(() => {
    if (!isInView) return

    const controls = animate(0, numeric, {
      duration: 1.8,
      ease: [0.21, 0.85, 0.45, 1],
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = Math.round(value).toLocaleString()
        }
      },
    })

    return () => controls.stop()
  }, [numeric, isInView])

  return (
    <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extralight text-white tracking-tight">
      <span ref={ref}>0</span>
      {hasPlus && <span className="text-teal-mid font-light ml-0.5">+</span>}
    </span>
  )
}

export default function HomeImpactBar() {
  return (
    <section className="bg-ink py-10 sm:py-16 border-t border-b border-white/5 relative overflow-hidden">
      {/* Subtle ambient light gradient inside the dark bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-gold/5 pointer-events-none" />

      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6 relative z-10">
          {impactMetrics.map((metric, i) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={cn(
                'text-center px-2 py-4 flex flex-col justify-between items-center transition-all duration-300',
                // Desktop vertical dividers
                i < impactMetrics.length - 1 && 'lg:border-r lg:border-white/10'
              )}
            >
              <div className="mb-2">
                <CountUp value={metric.value} />
              </div>
              <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white/50 leading-relaxed max-w-[150px] mx-auto">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

