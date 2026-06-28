import { AnimatedSection } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

interface VisionMeta {
  title_highlight?: string
}

export default function HomeHero() {
  const { content } = useSiteContent()
  const section = content?.sections?.vision_agenda
  const eyebrow: string = section?.eyebrow || 'The Visionary Agenda'
  const title: string = section?.title || "One doctor's blueprint for a"
  const highlight: string =
    (section?.metadata as VisionMeta | undefined)?.title_highlight ||
    'self-sufficient healthcare Africa'
  const imageUrl: string = section?.image_url || '/image.png'

  return (
    <section className="section-padding bg-paper min-h-[85vh] flex items-center pt-24 lg:pt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatedSection>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-teal mb-6">
                {eyebrow}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4.75rem] lg:leading-[1.15] font-light text-ink mb-10">
                {title} <br />
                <em className="text-teal-mid italic">{highlight}</em>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="border-t border-rule py-6 grid grid-cols-3 gap-6">
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">
                    Identity I
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl text-ink font-normal">Physician</h3>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">
                    Identity II
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl text-ink font-normal">
                    Entrepreneur
                  </h3>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">
                    Identity III
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl text-ink font-normal">
                    Nation Builder
                  </h3>
                </div>
              </div>
              <div className="border-b border-rule mb-8" />
            </AnimatedSection>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <AnimatedSection delay={0.2} className="w-full max-w-sm">
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-ink-muted text-center mb-3">
                DR. LIYANA — PROFILE
              </p>
              <div className="border border-rule p-2.5 bg-white shadow-sm">
                <img
                  src={imageUrl}
                  alt="Dr. Girma Ababi"
                  className="w-full object-cover aspect-square hover:grayscale transition-all duration-700"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
