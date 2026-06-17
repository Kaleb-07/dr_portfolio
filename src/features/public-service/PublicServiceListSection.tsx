import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { AnimatedSection, Container, Card, Button } from '@/components/shared'
import { publicServiceRoles, publicServiceDescription } from '@/data/public-service'
import type { PublicServiceRole } from '@/types'

const categoryConfig: Record<PublicServiceRole['category'], { label: string; tag: string; description: string }> = {
  advisory: {
    label: 'Advisory Roles',
    tag: 'Ministry Advisory',
    description: 'Strategic advisory positions shaping national health policy.',
  },
  federation: {
    label: 'Federation Leadership',
    tag: 'Continental Leadership',
    description: 'Leading continental healthcare federations.',
  },
  innovation: {
    label: 'Innovation Programs',
    tag: 'Innovation & Quality',
    description: 'Health systems resilience and innovation.',
  },
  policy: {
    label: 'Policy Impact',
    tag: 'Regulatory Policy',
    description: 'National and continental policy frameworks.',
  },
}

const serviceStats = [
  { value: '6+', label: 'Active Public Roles' },
  { value: '4', label: 'Ministry Positions' },
  { value: '2', label: 'National Federations' },
  { value: '2023', label: 'VP, EHF Appointed' },
]

const CATEGORY_ORDER: PublicServiceRole['category'][] = ['advisory', 'federation', 'innovation', 'policy']

export default function PublicServiceListSection() {
  const statsRef = useRef<HTMLElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' })

  const grouped = CATEGORY_ORDER.reduce<Record<PublicServiceRole['category'], PublicServiceRole[]>>(
    (acc, key) => {
      acc[key] = publicServiceRoles.filter((r) => r.category === key)
      return acc
    },
    { advisory: [], federation: [], innovation: [], policy: [] }
  )

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-paper min-h-[80vh] flex items-center pt-28 lg:pt-36">
        <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">Public Service</span>
                  <span className="section-rule" />
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4.5rem] lg:leading-[1.12] font-light text-ink mb-8">
                  Serving the nation.{' '}
                  <em className="text-teal-mid not-italic">
                    Shaping its future.
                  </em>
                </h1>
                <p className="text-sm font-light text-ink-mid leading-relaxed max-w-xl">
                  {publicServiceDescription}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <div className="border-t border-rule py-6 grid grid-cols-3 gap-6 mt-8">
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">Scope</p>
                    <h3 className="font-serif text-lg text-ink font-normal">National</h3>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">Positions</p>
                    <h3 className="font-serif text-lg text-ink font-normal">6+ Roles</h3>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">Focus</p>
                    <h3 className="font-serif text-lg text-ink font-normal">Policy</h3>
                  </div>
                </div>
                <div className="border-b border-rule" />
              </AnimatedSection>
            </div>

            {/* Right – portrait */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
              <AnimatedSection delay={0.2} className="w-full max-w-sm">
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-ink-muted text-center mb-3">
                  DR. LIYANA — PUBLIC SERVICE
                </p>
                <div className="border border-rule p-2.5 bg-white shadow-sm">
                  <img
                    src="/image.png"
                    alt="Dr. Liyana"
                    className="w-full grayscale object-cover aspect-square hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact Stats ──────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="bg-ink py-10 sm:py-16 border-t border-b border-white/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-gold/5 pointer-events-none" />
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6 relative z-10">
            {serviceStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="text-center px-2 py-4"
              >
                <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extralight text-white tracking-tight mb-2">
                  {stat.value}
                </p>
                <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white/50 leading-relaxed">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Role Sections ─────────────────────────────────────────────────── */}
      {CATEGORY_ORDER.map((key, sectionIndex) => {
        const roles = grouped[key]
        if (!roles || roles.length === 0) return null
        const config = categoryConfig[key]

        return (
          <section
            key={key}
            className={`section-padding ${sectionIndex % 2 === 0 ? 'bg-paper' : 'bg-paper-warm'}`}
          >
            <Container>
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">{config.tag}</span>
                  <span className="section-rule" />
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-4">
                  {config.label}
                </h2>
                <p className="text-sm font-light text-ink-mid max-w-2xl mb-10">
                  {config.description}
                </p>
              </AnimatedSection>

              <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role, i) => (
                  <AnimatedSection key={role.id} delay={i * 0.06}>
                    <Card className="bg-white border-l-2 border-teal pl-5 h-full">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-lg font-light text-ink">{role.title}</h3>
                        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold shrink-0 ml-4">
                          {role.period}
                        </span>
                      </div>
                      <p className="text-sm text-teal mb-2">{role.organization}</p>
                      <p className="text-sm font-light text-ink-mid leading-relaxed mb-4">
                        {role.description}
                      </p>
                      {role.highlights.length > 0 && (
                        <ul className="space-y-1.5">
                          {role.highlights.map((h, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-ink-muted">
                              <span className="w-3 h-[0.5px] bg-teal mt-2 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </Container>
          </section>
        )
      })}

      {/* ── Contact CTA ───────────────────────────────────────────────────── */}
      <section className="section-padding bg-teal relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.15, scale: 1.1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute -left-12 -top-24 w-[400px] h-[400px] rounded-full blur-[100px] bg-gold-light"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.1, scale: 1.1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
            className="absolute -right-12 -bottom-24 w-[500px] h-[500px] rounded-full blur-[120px] bg-teal-light"
          />
        </div>
        <Container className="relative z-10 text-center">
          <AnimatedSection>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/50 mb-6">
              Collaborate
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl font-light text-white mb-6">
              Partner on{' '}
              <em className="not-italic text-gold-light">policy &amp; health systems</em>
            </h2>
            <p className="text-sm font-light text-white/70 leading-relaxed max-w-xl mx-auto mb-10">
              Whether you represent a government body, professional federation, or international health organisation — Dr. Liyana welcomes strategic collaboration.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link to="/contact">
                <Button
                  variant="ghost"
                  size="lg"
                  className="border border-white text-white hover:bg-white hover:text-teal transition-all duration-300"
                >
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
