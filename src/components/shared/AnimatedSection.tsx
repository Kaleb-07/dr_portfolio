import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const AnimatedSection = ({ children, className, delay = 0 }: AnimatedSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection
