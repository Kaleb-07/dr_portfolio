import { motion } from 'framer-motion'

interface PageBannerProps {
  title: string
  description?: string
}

export default function PageBanner({ title, description }: PageBannerProps) {
  return (
    <section className="bg-paper-warm py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 text-lg text-ink-mid max-w-2xl"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
