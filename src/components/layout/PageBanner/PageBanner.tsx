import { motion } from 'framer-motion'

interface PageBannerProps {
  title: string
  description?: string
}

export default function PageBanner({ title, description }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-paper-warm py-20 lg:py-24 border-b border-rule">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1.1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute -right-10 top-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full blur-[90px] bg-gold-light"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
          className="absolute -left-10 bottom-0 w-[200px] md:w-[350px] h-[200px] md:h-[350px] rounded-full blur-[100px] bg-teal-light"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12 lg:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-lg text-ink-mid max-w-2xl font-light"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
