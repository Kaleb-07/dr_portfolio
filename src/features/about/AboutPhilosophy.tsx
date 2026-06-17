import { AnimatedSection, Container } from '@/components/shared'
import { leadershipPhilosophy } from '@/data/about'

export default function AboutPhilosophy() {
  return (
    <section className="section-padding bg-paper-warm">
      <Container className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center">
          <div className="section-header justify-center">
            <span className="section-rule" />
            <span className="section-tag">Philosophy</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-8">
            Leadership philosophy
          </h2>
          <blockquote className="font-serif text-xl lg:text-2xl italic font-light text-ink-mid leading-relaxed max-w-3xl mx-auto">
            &ldquo;{leadershipPhilosophy}&rdquo;
          </blockquote>
        </AnimatedSection>
      </Container>
    </section>
  )
}
