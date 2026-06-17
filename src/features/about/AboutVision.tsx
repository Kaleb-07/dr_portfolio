import { AnimatedSection, Container } from '@/components/shared'
import { vision } from '@/data/about'

export default function AboutVision() {
  return (
    <section className="bg-teal text-white text-center py-24">
      <Container className="max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 mb-8">Vision</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-8">
            A healthier Africa
          </h2>
          <blockquote className="font-serif text-xl lg:text-2xl italic font-light text-white/80 leading-relaxed max-w-3xl mx-auto">
            &ldquo;{vision}&rdquo;
          </blockquote>
        </AnimatedSection>
      </Container>
    </section>
  )
}
