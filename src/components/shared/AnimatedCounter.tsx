import { cn } from '@/lib/utils'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedCounterProps {
  value: string
  label: string
  duration?: number
  className?: string
}

const AnimatedCounter = ({
  value,
  label,
  className,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const hasPlus = value.endsWith('+')
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ''))
  const displayValue = Math.round(numeric)

  return (
    <div
      ref={ref}
      className={cn('text-center', className)}
    >
      <motion.span
        className="font-serif text-4xl font-bold text-[--color-primary] md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {isInView ? displayValue : 0}
        {hasPlus && <span>+</span>}
      </motion.span>
      <p className="mt-2 text-sm font-semibold tracking-widest text-accent uppercase">
        {label}
      </p>
    </div>
  )
}

export default AnimatedCounter
