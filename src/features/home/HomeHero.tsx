import { AnimatedSection } from '@/components/shared'
import heroData from '@/data/hero'
import { siteConfig } from '@/constants/site'
import { useSiteContent } from '@/hooks/useSiteContent'
import { mapCmsHtml } from '@/lib/html'

export default function HomeHero() {
  const { content } = useSiteContent()
  const section = content?.sections.vision_agenda
  const hero = section || {
    eyebrow: siteConfig.hero.eyebrow,
    title: siteConfig.hero.headline,
    subtitle: heroData.name,
    description: siteConfig.hero.description,
    image_url: '/image.png',
    image_alt: heroData.name,
    blocks: [
      { id: 1, eyebrow: 'Identity I', title: 'Physician' },
      { id: 2, eyebrow: 'Identity II', title: 'Entrepreneur' },
      { id: 3, eyebrow: 'Identity III', title: 'Nation Builder' },
    ],
  }

  return (
    <section className="section-padding bg-paper min-h-[85vh] flex items-center pt-24 lg:pt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatedSection>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-teal mb-6">
                {hero.eyebrow}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1
                className="font-serif text-4xl sm:text-5xl lg:text-[4.75rem] lg:leading-[1.15] font-light text-ink mb-10"
                dangerouslySetInnerHTML={{ __html: mapCmsHtml(hero.title || '') }}
              />
            </AnimatedSection>

            {/* Split Grid */}
            <AnimatedSection delay={0.2}>
              <div className="border-t border-rule py-6 grid grid-cols-3 gap-6">
                {hero.blocks.map((item) => (
                  <div key={item.id}>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">{item.eyebrow}</p>
                    <h3 className="font-serif text-lg sm:text-xl text-ink font-normal">{item.title}</h3>
                  </div>
                ))}
              </div>
              <div className="border-b border-rule mb-8" />
            </AnimatedSection>

            {/* <AnimatedSection delay={0.3}>
              <p className="text-base sm:text-lg font-light text-ink-mid leading-relaxed max-w-xl">
                A lifetime dedicated to recalibrating the intersection of medical precision and systemic scalability. Dr. Girma Ababi transforms clinical challenges into sustainable national infrastructures.
              </p>
            </AnimatedSection> */}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <AnimatedSection delay={0.2} className="w-full max-w-sm">
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-ink-muted text-center mb-3">
                {hero.subtitle}
              </p>
              <div className="border border-rule p-2.5 bg-white shadow-sm">
                <img
                  src={hero.image_url || ''}
                  alt={hero.image_alt || ''}
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
