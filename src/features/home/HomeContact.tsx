import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Container, Button } from '@/components/shared'
import { contactInfo } from '@/data/contact'

export default function HomeContact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden section-padding bg-paper-warm"
    >
      {/* Decorative background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.15, scale: 1.1 } : {}}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute -right-20 -bottom-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-[100px] bg-teal-light"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.3 }}
          className="absolute -left-20 top-10 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full blur-[120px] bg-gold-light"
        />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Form intro / link */}
          <div className="flex flex-col justify-center">
            {/* Tag */}
            <div className="section-header mb-6">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="section-tag"
              >
                Connect
              </motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="section-rule origin-left"
              />
            </div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-light text-ink mb-6"
            >
              Let&rsquo;s work <em className="text-teal-mid not-italic">together</em>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm font-light text-ink-mid leading-relaxed mb-8 max-w-lg"
            >
              Whether you are exploring partnership opportunities, inviting me to speak, or collaborating on health policy — I would love to hear from you.
            </motion.p>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="self-start"
            >
              <Link to="/contact">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-teal text-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Send a Message
                </Button>
              </Link>
            </motion.div>

            {/* Provided Image to fill blank space */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 max-w-md w-full"
            >
              <div className="border border-rule p-2 bg-white shadow-sm group">
                <img
                  src="/image.png"
                  alt="Contact"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/lab-connect.png' }}
                  className="w-full grayscale-[30%] object-cover aspect-[16/10] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <p className="mt-2 text-[9px] font-mono tracking-widest uppercase text-ink-muted">
                Liyana Healthcare Laboratory &mdash; Policy & Research Hub
              </p>
            </motion.div>
          </div>

          {/* Right Column - Inquiry Types */}
          <div className="flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 0.6, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-6"
            >
              Inquiry Types
            </motion.p>

            <div className="space-y-4">
              {contactInfo.inquiryTypes.map((type, idx) => (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: 0.25 + idx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-start gap-4 p-4 -mx-4 rounded-lg hover:bg-white/40 transition-all duration-300 cursor-default"
                >
                  <span className="w-4 h-[0.5px] bg-teal mt-3 shrink-0 transition-all duration-300 group-hover:w-8 group-hover:bg-teal-mid" />
                  <div className="transition-transform duration-300 group-hover:translate-x-1">
                    <p className="text-sm text-ink mb-1 font-medium transition-colors duration-200 group-hover:text-teal">
                      {type.label}
                    </p>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
