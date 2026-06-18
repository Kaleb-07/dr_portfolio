import { AnimatedSection, Container } from '@/components/shared'
import { impactStories } from '@/data/foundation'
import { motion } from 'framer-motion'

export default function FoundationStoriesSection() {
  return (
    <section className="section-padding bg-paper relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[350px] h-[350px] rounded-full blur-[90px] bg-gold-light" />
      </div>

      <Container className="relative z-10">
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Impact</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-16">
            Stories of <em className="text-teal-mid not-italic">change</em>
          </h2>
        </AnimatedSection>

        {/* Magazine layout: featured story top, two below */}
        <div className="space-y-0 border-t border-rule divide-y divide-rule max-w-4xl mx-auto">
          {impactStories.map((story, i) => (
            <AnimatedSection key={story.title} delay={i * 0.12}>
              <div className="py-10 md:py-12 grid md:grid-cols-12 gap-6 items-start group cursor-default">
                {/* Left: Number watermark + beneficiary tag */}
                <div className="md:col-span-3 flex flex-col justify-between h-full">
                  <span
                    className="font-serif text-[5rem] md:text-[7rem] font-light leading-none text-rule/60 group-hover:text-teal-light/70 transition-colors duration-500 select-none"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-4 md:mt-0 font-mono text-[8px] tracking-[0.2em] uppercase text-teal border border-teal/30 bg-teal-light/40 px-2 py-1 self-start">
                    {story.beneficiary}
                  </span>
                </div>

                {/* Right: Story content */}
                <div className="md:col-span-9 relative pl-0 md:pl-6 md:border-l border-rule group-hover:border-teal/30 transition-colors duration-300">
                  {/* Hover top accent */}
                  <motion.div
                    className="absolute top-0 left-0 md:left-6 right-0 h-[1.5px] bg-gradient-to-r from-teal to-gold origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Decorative quote mark */}
                  <span className="absolute -top-2 right-0 font-serif text-6xl text-gold/10 leading-none select-none pointer-events-none">
                    &rdquo;
                  </span>

                  <h3 className="font-serif text-xl md:text-2xl font-light text-ink mb-4 group-hover:text-teal transition-colors duration-300 relative z-10">
                    {story.title}
                  </h3>
                  <p className="text-sm font-light text-ink-mid leading-relaxed relative z-10">
                    {story.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
