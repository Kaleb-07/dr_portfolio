import { AnimatedSection, Container } from '@/components/shared'
import { education } from '@/data/education'
import { FaGraduationCap, FaChevronRight } from 'react-icons/fa'

export default function EducationListSection() {
  return (
    <section className="section-padding bg-paper">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Credentials</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-16">
            Academic <em className="text-teal-mid not-italic">foundations</em>
          </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {education.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start group relative">
                {/* Visual vertical side anchor */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-rule group-hover:bg-teal transition-colors duration-300 hidden md:block" />

                {/* Left side timeline summary */}
                <div className="md:col-span-4 pl-0 md:pl-8 flex flex-col justify-start">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center bg-teal-light text-teal rounded-full w-8 h-8 shrink-0">
                      <FaGraduationCap size={13} />
                    </span>
                    <span className="font-mono text-xs tracking-widest text-teal font-bold">{item.year}</span>
                  </div>
                  <h4 className="font-serif text-lg text-ink font-normal leading-snug">
                    {item.institution}
                  </h4>
                  <p className="font-mono text-[9px] tracking-wider text-ink-muted uppercase mt-1">
                    {item.field}
                  </p>
                </div>

                {/* Right side credentials info */}
                <div className="md:col-span-8 bg-white/40 border border-rule p-8 hover:bg-white hover:border-teal-mid/30 hover:shadow-md transition-all duration-300">
                  <h3 className="font-serif text-xl font-light text-teal mb-3">{item.degree}</h3>
                  <p className="text-sm font-light text-ink-mid leading-relaxed mb-6">
                    {item.description}
                  </p>
                  
                  {item.highlights.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-mono text-[8px] tracking-widest text-gold uppercase font-bold">Highlights</p>
                      <ul className="space-y-2">
                        {item.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-ink-mid">
                            <FaChevronRight className="text-teal shrink-0 mt-1.5" size={10} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {i < education.length - 1 && (
                <div className="border-t border-rule mt-12 mb-4" />
              )}
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
