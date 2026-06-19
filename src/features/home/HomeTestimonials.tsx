import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Container } from '@/components/shared'
import { testimonials } from '@/data/testimonials'
import { cn } from '@/lib/utils'

const displayed = testimonials.slice(0, 3)

function getInitials(name: string) {
  return name
    .replace(/^(H\.E\.|Dr\.|Prof\.|Ato|W\/ro|PDG)\s+/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const leftItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-paper py-20 md:py-28">
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.4, scale: 1.1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute -left-32 top-1/3 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full blur-[120px] bg-teal-light"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.3, scale: 1.1 } : {}}
          transition={{ duration: 2.4, ease: 'easeOut', delay: 0.3 }}
          className="absolute -right-24 -bottom-24 w-[350px] md:w-[550px] h-[350px] md:h-[550px] rounded-full blur-[140px] bg-gold-light"
        />
      </div>

      <Container className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ─── LEFT COLUMN — Headline + CTA ─── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col justify-center"
          >
            <motion.div variants={leftItemVariants}>
              <div className="section-header">
                <span className="section-tag">Testimonials</span>
                <span className="section-rule" />
              </div>
            </motion.div>

            <motion.h2
              variants={leftItemVariants}
              className="font-serif text-4xl md:text-5xl font-light text-ink leading-tight"
            >
              Trusted by <span className="text-teal">Leaders</span>
              <br />
              Across Africa
            </motion.h2>

            <motion.p
              variants={leftItemVariants}
              className="mt-6 text-sm text-ink-muted leading-relaxed max-w-sm"
            >
              From government ministers to academic pioneers &mdash; hear from those who have
              worked alongside Dr.&nbsp;Girma&nbsp;Ababi and witnessed his impact on
              healthcare across the continent.
            </motion.p>

            <motion.div variants={leftItemVariants} className="mt-8">
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-teal text-white text-2xs font-medium tracking-widest uppercase hover:bg-teal-mid transition-colors duration-300"
              >
                <span>Share Your Story</span>
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <path d="M1 7H13M13 7L8 2M13 7L8 12" />
                </motion.svg>
              </a>
            </motion.div>
          </motion.div>

          {/* ─── RIGHT COLUMN — Floating Cards ─── */}
          <div className="relative flex flex-col gap-6 py-4">
            {displayed.map((t, i) => {
              const isFeatured = i === 1

              return (
                <motion.div
                  key={t.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  whileHover={{ y: -4 }}
                  className={cn(
                    'relative w-full max-w-lg rounded-xl bg-paper-card transition-shadow duration-500 pl-7 pr-6 py-6 flex gap-5 items-start cursor-default',
                    isFeatured
                      ? 'shadow-[0_8px_30px_rgba(15,110,86,0.06)] border border-teal/10 hover:shadow-[0_12px_40px_rgba(15,110,86,0.12)]'
                      : 'shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-rule hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
                  )}
                >
                  {/* Left edge indicator bar — animated height on hover */}
                  <motion.div
                    layout
                    className={cn(
                      'absolute left-0 top-0 w-[3px] rounded-r',
                      isFeatured ? 'bg-teal' : 'bg-ink-faint'
                    )}
                    initial={{ height: '40%', top: '30%' }}
                    whileHover={{ height: '100%', top: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />

                  {/* Double quote icon — subtle rotate on hover */}
                  <motion.div
                    className="absolute top-5 right-5 select-none pointer-events-none"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 28 28"
                      fill="none"
                      className={isFeatured ? 'text-teal/15' : 'text-ink-faint/30'}
                    >
                      <path
                        d="M8.568 19.432C6.568 18.082 5.168 16.232 4.368 13.882C3.6347 11.7153 3.60133 9.39867 4.268 7.232C4.93467 5.06533 6.168 3.232 7.968 1.732L10.368 3.982C9.168 5.06533 8.28467 6.31533 7.718 7.732C7.15133 9.14867 6.93467 10.5987 7.068 12.082C7.63467 11.9153 8.28467 11.832 9.018 11.832C11.018 11.832 12.6513 12.482 13.918 13.782C15.2513 15.082 15.918 16.6987 15.918 18.632C15.918 20.632 15.2847 22.2653 14.018 23.532C12.7513 24.7987 11.118 25.432 9.118 25.432C7.118 25.432 5.48467 24.7987 4.218 23.532C2.95133 22.2653 2.318 20.632 2.318 18.632C2.318 18.0987 2.38467 17.4487 2.518 16.682C6.18467 18.4153 8.08467 19.282 9.218 19.432H8.568Z"
                        fill="currentColor"
                      />
                      <path
                        d="M23.868 19.432C21.868 18.082 20.468 16.232 19.668 13.882C18.9347 11.7153 18.9013 9.39867 19.568 7.232C20.2347 5.06533 21.468 3.232 23.268 1.732L25.668 3.982C24.468 5.06533 23.5847 6.31533 23.018 7.732C22.4513 9.14867 22.2347 10.5987 22.368 12.082C22.9347 11.9153 23.5847 11.832 24.318 11.832C26.318 11.832 27.9513 12.482 29.218 13.782C30.5513 15.082 31.218 16.6987 31.218 18.632C31.218 20.632 30.5847 22.2653 29.318 23.532C28.0513 24.7987 26.418 25.432 24.418 25.432C22.418 25.432 20.7847 24.7987 19.518 23.532C18.2513 22.2653 17.618 20.632 17.618 18.632C17.618 18.0987 17.6847 17.4487 17.818 16.682C21.4847 18.4153 23.3847 19.282 24.518 19.432H23.868Z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>

                  {/* Avatar */}
                  <motion.div
                    className={cn(
                      'shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-2xs font-medium text-white',
                      isFeatured ? 'bg-teal' : 'bg-gold'
                    )}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    {getInitials(t.author)}
                  </motion.div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pr-6">
                    <h4 className="font-serif font-medium text-base text-ink leading-tight">
                      {t.author}
                    </h4>
                    <p className="text-2xs text-ink-muted mt-0.5 leading-snug">
                      {t.title}, {t.organization}
                    </p>
                    <div className="mt-2">
                      <motion.p
                        layout
                        className={cn(
                          'text-xs text-ink-mid leading-relaxed font-light',
                          expandedId !== t.id && 'line-clamp-3'
                        )}
                        onClick={() =>
                          setExpandedId(expandedId === t.id ? null : t.id)
                        }
                      >
                        &ldquo;{t.quote}&rdquo;
                      </motion.p>
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === t.id ? null : t.id)
                        }
                        className="mt-1 text-[10px] font-medium tracking-wider uppercase text-teal hover:text-teal-mid transition-colors duration-200"
                      >
                        {expandedId === t.id ? 'Show less' : 'Read more'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
