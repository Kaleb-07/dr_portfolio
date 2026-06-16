import { motion } from 'framer-motion'

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral">
      <div className="text-center">
        <motion.div
          className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-accent border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="font-serif text-lg text-primary">Loading...</p>
      </div>
    </div>
  )
}
