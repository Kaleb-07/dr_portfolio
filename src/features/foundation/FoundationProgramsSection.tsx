import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedSection, Container } from '@/components/shared'
import { programs } from '@/data/foundation'
import { useSiteContent } from '@/hooks/useSiteContent'
import {
  FaHeartbeat,
  FaGraduationCap,
  FaHospital,
  FaHandshake,
  FaBuilding,
} from 'react-icons/fa'

const programIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  'community-health-outreach': FaHeartbeat,
  'education-access': FaGraduationCap,
  'healthcare-access': FaHospital,
  'professional-empowerment': FaHandshake,
  'future-health-infrastructure': FaBuilding,
}

export default function FoundationProgramsSection() {
  const { content } = useSiteContent()
  const section = content?.sections.foundation || content?.sections.foundation_story
  const cmsPrograms = Array.isArray(section?.metadata?.programs) ? section.metadata.programs : []
  const displayedPrograms = cmsPrograms.length > 0 ? cmsPrograms : programs
  const [activeId, setActiveId] = useState(displayedPrograms[0]?.id ?? '')
  const activeProgram = displayedPrograms.find((p) => p.id === activeId) ?? displayedPrograms[0]
  const programsTitle = (section?.metadata?.programsTitle as string) || 'Our programs'
  const programsEyebrow = (section?.metadata?.programsEyebrow as string) || 'Programs'

  useEffect(() => {
    if (!displayedPrograms.some((program) => program.id === activeId)) {
      setActiveId(displayedPrograms[0]?.id ?? '')
    }
  }, [displayedPrograms, activeId])

  return (
    <section className="section-padding bg-paper-warm relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] bg-teal-light" />
      </div>

      <Container className="relative z-10">
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">{programsEyebrow}</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-14">
            {/* Our <em className="text-teal-mid not-italic">programs</em> */}
            {programsTitle}
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Program Selector List */}
          <div className="lg:col-span-4 border-t border-rule divide-y divide-rule">
            {displayedPrograms.map((program, i) => {
              const Icon = programIcons[program.id] ?? FaHeartbeat
              const isActive = program.id === activeId
              return (
                <AnimatedSection key={program.id} delay={i * 0.06}>
                  <button
                    onClick={() => setActiveId(program.id)}
                    className={`w-full flex items-center gap-4 py-5 px-4 text-left group transition-all duration-300
                      ${isActive
                        ? 'bg-white border-l-2 border-teal shadow-sm'
                        : 'hover:bg-white/50 border-l-2 border-transparent'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                      ${isActive ? 'bg-teal text-white' : 'bg-rule/50 text-ink-muted group-hover:bg-teal-light group-hover:text-teal'}`}
                    >
                      <Icon size={13} />
                    </div>
                    <span className={`text-sm font-light leading-snug transition-colors duration-200
                      ${isActive ? 'text-ink font-normal' : 'text-ink-mid group-hover:text-ink'}`}
                    >
                      {program.title}
                    </span>
                  </button>
                </AnimatedSection>
              )
            })}
          </div>

          {/* Right: Active Program Detail */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeProgram && (
                <motion.div
                  key={activeProgram.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white border border-rule p-8 md:p-10 relative overflow-hidden h-full"
                >
                  {/* Top accent gradient */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal via-teal-mid to-gold" />

                  <div className="flex items-start justify-between mb-6 gap-4">
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-2">
                        Active Program
                      </p>
                      <h3 className="font-serif text-2xl md:text-3xl font-light text-ink">
                        {activeProgram.title}
                      </h3>
                    </div>
                    {/* Pulsing status badge */}
                    <span className="inline-flex items-center gap-2 bg-teal-light text-teal font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 shrink-0 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                      {activeProgram.status}
                    </span>
                  </div>

                  <p className="text-sm font-light text-ink-mid leading-relaxed mb-8">
                    {activeProgram.description}
                  </p>

                  <div className="border-t border-rule pt-6 grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="font-mono text-[8px] tracking-widest uppercase text-gold mb-2 font-bold">Impact</p>
                      <p className="text-sm font-light text-ink-mid">{activeProgram.impact}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] tracking-widest uppercase text-teal mb-2 font-bold">Beneficiaries</p>
                      <p className="text-sm font-light text-ink-mid">{activeProgram.beneficiaries}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  )
}
