import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryItem } from '@/types'

interface ImageGalleryProps {
  items: GalleryItem[]
  columns?: 2 | 3 | 4
}

const allCategoriesLabel = 'All'

const ImageGallery = ({ items, columns = 3 }: ImageGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(allCategoriesLabel)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const categories = [
    allCategoriesLabel,
    ...new Set(items.map((item) => item.category)),
  ] as string[]

  const filtered =
    activeCategory === allCategoriesLabel
      ? items
      : items.filter((item) => item.category === activeCategory)

  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div>
      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              activeCategory === cat
                ? 'bg-[--color-primary] text-white'
                : 'bg-[--color-neutral] text-[--color-text-secondary] hover:bg-[--color-border]',
            )}
          >
            {cat === allCategoriesLabel ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        key={activeCategory}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className={cn('grid gap-4', gridCols[columns])}
      >
        {filtered.map((item, index) => (
          <motion.div
            key={item.id}
            variants={staggerItem}
            className="group relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="aspect-4/3 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
              <p className="text-sm font-medium text-white">
                {item.caption}
              </p>
              {item.location && (
                <p className="mt-1 text-xs text-white/70">
                  {item.location}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(null)
              }}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(lightboxIndex - 1)
                }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {lightboxIndex < filtered.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(lightboxIndex + 1)
                }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex]?.src ?? ''}
                alt={filtered[lightboxIndex]?.alt ?? ''}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
              <div className="mt-3 text-center">
                <p className="text-sm font-medium text-white">
                  {filtered[lightboxIndex]?.caption}
                </p>
                {filtered[lightboxIndex]?.location && (
                  <p className="mt-1 text-xs text-white/70">
                    {filtered[lightboxIndex]?.location}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImageGallery
