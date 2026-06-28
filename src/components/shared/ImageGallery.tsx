import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryItem } from '@/types'

// Category-to-placeholder color map for missing images
const categoryColors: Record<string, { bg: string; label: string }> = {
  leadership: { bg: 'bg-teal/10', label: 'Leadership' },
  healthcare:  { bg: 'bg-teal-light',  label: 'Healthcare' },
  education:   { bg: 'bg-gold-light',  label: 'Education' },
  awards:      { bg: 'bg-gold/10',     label: 'Awards' },
  community:   { bg: 'bg-paper-warm', label: 'Community' },
  conferences: { bg: 'bg-paper-card', label: 'Conferences' },
}

function GalleryPlaceholder({ item }: { item: GalleryItem }) {
  const scheme = categoryColors[item.category] ?? { bg: 'bg-paper-warm', label: item.category }
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${scheme.bg} border border-rule`}>
      <p className="font-mono text-[8px] tracking-widest uppercase text-teal mb-2">{scheme.label}</p>
      <p className="font-serif text-sm text-ink-mid text-center px-4 leading-snug max-w-[160px]">{item.caption}</p>
      {item.location && (
        <p className="font-mono text-[8px] tracking-widest text-ink-muted mt-2 uppercase">{item.location}</p>
      )}
    </div>
  )
}

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem
  onClick: () => void
}) {
  const [imgError, setImgError] = useState(false)

  if (!item.src) {
    return (
      <motion.div
        variants={staggerItem}
        className="group relative cursor-pointer overflow-hidden border border-rule"
        style={{ aspectRatio: '4/3' }}
        onClick={onClick}
      >
        <GalleryPlaceholder item={item} />
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={staggerItem}
      className="group relative cursor-pointer overflow-hidden border border-rule"
      style={{ aspectRatio: '4/3' }}
      onClick={onClick}
    >
      {imgError ? (
        <GalleryPlaceholder item={item} />
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* Caption overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
        <p className="text-sm font-light text-white leading-snug">{item.caption}</p>
        {item.location && (
          <p className="mt-1 font-mono text-[9px] tracking-widest uppercase text-white/60">{item.location}</p>
        )}
      </div>
      {/* Category tag */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="font-mono text-[8px] tracking-widest uppercase bg-white/20 backdrop-blur-sm text-white px-2 py-1">
          {item.category}
        </span>
      </div>
    </motion.div>
  )
}

interface ImageGalleryProps {
  items: GalleryItem[]
  columns?: 2 | 3 | 4
}

const allCategoriesLabel = 'All'

const ImageGallery = ({ items, columns = 3 }: ImageGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(allCategoriesLabel)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

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
      {/* Category Filters — design-system aligned */}
      <div className="mb-8 sm:mb-10 flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-mono tracking-widest uppercase transition-all duration-200 border',
              activeCategory === cat
                ? 'bg-teal text-white border-teal'
                : 'bg-white text-ink-mid border-rule hover:border-teal hover:text-teal hover:bg-teal-light active:bg-teal active:text-white active:border-teal active:scale-95',
            )}
          >
            {cat === allCategoriesLabel ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        key={activeCategory}
        ref={containerRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={cn('grid gap-4', gridCols[columns])}
      >
        {filtered.map((item) => (
          <GalleryCard
            key={item.id}
            item={item}
            onClick={() => setLightboxIndex(filtered.indexOf(item))}
          />
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
              className="relative max-h-[80vh] sm:max-h-[85vh] max-w-sm sm:max-w-2xl md:max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[lightboxIndex]?.src ? (
                <img
                  src={filtered[lightboxIndex]?.src ?? ''}
                  alt={filtered[lightboxIndex]?.alt ?? ''}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.classList.add('min-h-[300px]', 'flex', 'items-center', 'justify-center', 'bg-white/10', 'rounded-lg', 'p-8')
                    }
                  }}
                  className="max-h-[70vh] w-auto rounded-lg object-contain mx-auto block"
                />
              ) : null}
              <div className="mt-4 text-center px-4">
                <p className="text-sm font-serif text-white/90 leading-snug">
                  {filtered[lightboxIndex]?.caption}
                </p>
                {filtered[lightboxIndex]?.location && (
                  <p className="mt-2 font-mono text-[9px] tracking-widest uppercase text-white/50">
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
