import { AnimatedSection, Container } from '@/components/shared'
import { leadershipPhilosophy } from '@/data/about'

export default function AboutPhilosophy() {
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
          
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-10">
            Leadership philosophy
          </h2>

          <div className="glass-quote p-10 md:p-14 relative overflow-hidden text-center max-w-3xl mx-auto shadow-sm">
            {/* Background Quotes */}
            <span className="absolute -top-4 left-4 font-serif text-9xl text-gold/8 pointer-events-none select-none">
              &ldquo;
            </span>
            <span className="absolute -bottom-20 right-4 font-serif text-9xl text-gold/8 pointer-events-none select-none">
              &rdquo;
            </span>

            <blockquote className="relative z-10 font-serif text-xl lg:text-2xl italic font-light text-ink-mid leading-relaxed">
              &ldquo;{leadershipPhilosophy}&rdquo;
            </blockquote>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
