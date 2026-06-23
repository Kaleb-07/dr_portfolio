import { AnimatedSection, Container } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'
import { siteConfig } from '@/constants/site'

export default function AboutPhilosophy() {
  const { content } = useSiteContent()
  const section = content?.sections?.leadership_philosophy
  const eyebrow = section?.eyebrow || siteConfig.philosophy.label || 'Philosophy'
  const title = section?.title || siteConfig.philosophy.title || 'Leadership philosophy'
  const primaryQuote = section?.description || siteConfig.philosophy.quote
  const attribution = section?.subtitle || siteConfig.philosophy.attribution
  const quotes = Array.isArray(section?.blocks) && section.blocks.length > 0 ? section.blocks : [{ body: primaryQuote, title: attribution }]

  return (
    <section className="section-padding bg-paper-warm relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-10 w-[200px] h-[200px] rounded-full blur-[70px] bg-gold-light" />
      </div>

      <Container className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection className="text-center">
          <div className="section-header justify-center mb-6">
            <span className="section-rule" />
            <span className="section-tag">Philosophy</span>
            <span className="section-rule" />
          </div>
          
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-10">{title}</h2>

          <div className="glass-quote p-10 md:p-14 relative overflow-hidden text-center max-w-3xl mx-auto shadow-sm">
            {/* Background Quotes */}
            <span className="absolute -top-4 left-4 font-serif text-9xl text-gold/8 pointer-events-none select-none">
              &ldquo;
            </span>
            <span className="absolute -bottom-20 right-4 font-serif text-9xl text-gold/8 pointer-events-none select-none">
              &rdquo;
            </span>

            <div className="relative z-10 space-y-6">
              {quotes.map((q, i) => (
                <blockquote key={i} className="font-serif text-xl lg:text-2xl italic font-light text-ink-mid leading-relaxed">
                  &ldquo;{q.body || q.description || ''}&rdquo;
                  {q.title && <div className="mt-3 text-sm font-semibold text-ink-mid">{q.title}</div>}
                </blockquote>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
