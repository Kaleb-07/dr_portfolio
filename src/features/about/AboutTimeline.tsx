import { AnimatedSection, Container } from '@/components/shared'
import { journey } from '@/data/about'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AboutTimeline() {
  const { content } = useSiteContent()
  const cmsEvents = content?.timelineEvents || []
  const events =
    cmsEvents.length > 0
      ? cmsEvents
      : journey

  return (
    <section className="section-padding bg-paper-warm relative overflow-hidden">
      {/* Soft background glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-10 -left-10 w-[300px] h-[300px] rounded-full blur-[90px] bg-teal-light" />
      </div>

      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Milestones</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-10 md:mb-16">
            Key moments that <em className="text-teal-mid not-italic">defined</em> the journey
          </h2>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Dotted Centerline Rail (md and up) */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 pointer-events-none hidden sm:block"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, var(--color-rule) 0 6px, transparent 6px 12px)',
            }}
          />

          <div className="space-y-12 relative">
            {events.map((item: any, i: number) => {
              const isEven = i % 2 === 0
              return (
                <AnimatedSection key={i} delay={i * 0.05}>
                  <div
                    className={`flex flex-col sm:flex-row items-start ${isEven ? 'sm:flex-row-reverse' : ''} relative`}
                  >
                    {/* Glowing Year Node Circle on Timeline */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-1.5 z-10 w-9 h-9 rounded-full bg-white border border-teal flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110 hover:border-teal-mid">
                      <span className="font-mono text-[9px] font-bold text-teal">
                        {item.year || item.title || ''}
                      </span>
                    </div>

                    {/* Timeline Card Column */}
                    <div
                      className={`w-full sm:w-[calc(50%-2rem)] ml-12 sm:ml-0 ${isEven ? 'sm:pl-8' : 'sm:pr-8'} text-left`}
                    >
                      <div className="bg-white p-4 sm:p-6 border border-rule shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative group hover:border-teal-mid/50 hover:shadow-md transition-all duration-300">
                        {/* Hover accent gold strip */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold to-gold-light origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                        <p className="font-mono text-[8px] tracking-[0.2em] text-gold uppercase mb-2 font-bold">
                          Milestone {String(i + 1).padStart(2, '0')}
                        </p>

                        <p className="text-sm font-light text-ink-mid leading-relaxed">
                          {item.title || item.milestone || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}