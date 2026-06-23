import { AnimatedSection, Container } from '@/components/shared'
import { coreValues as fallbackValues } from '@/data/about'
import { useSiteContent } from '@/hooks/useSiteContent'
import { FaBuilding, FaUsers, FaNetworkWired, FaHeart } from 'react-icons/fa'

const valueIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Institution Building": FaBuilding,
  "Professional Empowerment": FaUsers,
  "Integrated Systems Thinking": FaNetworkWired,
  "Service to Nation": FaHeart,
}

export default function AboutValues() {
  const { content } = useSiteContent()
  const section = content?.sections?.about_values
  const values = (section && section.blocks && section.blocks.length ? section.blocks : fallbackValues)

  return (
    <section className="section-padding bg-paper">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Values</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
            Principles that <em className="text-teal-mid not-italic">guide</em> every decision
          </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto border-t border-rule divide-y divide-rule">
          {values.map((value, i) => {
            const Icon = valueIcons[value.title] || FaHeart
            return (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <div className="py-8 md:py-10 grid md:grid-cols-12 gap-6 items-start group hover:bg-paper-warm/30 px-6 transition-colors duration-300">
                  {/* Left Column: Number + Icon + Title */}
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-rule flex items-center justify-center bg-white shadow-sm transition-all duration-300 group-hover:bg-teal group-hover:border-teal group-hover:scale-105 shrink-0">
                      <Icon className="text-teal group-hover:text-white transition-colors duration-300" size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-normal text-ink group-hover:text-teal transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="font-mono text-[9px] tracking-widest text-gold uppercase mt-0.5">
                        Principle {String(i + 1).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                  {/* Right Column: Description */}
                  <div className="md:col-span-7">
                    <p className="text-sm font-light text-ink-mid leading-relaxed">
                      {value.description || value.body}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
