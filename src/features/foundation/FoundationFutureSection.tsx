import { AnimatedSection, Container } from '@/components/shared'
import { futureVision } from '@/data/foundation'

export default function FoundationFutureSection() {
  return (
    <section className="bg-teal text-white text-center py-24">
      <Container className="max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 mb-6">Future Vision</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-8">Looking ahead</h2>
          <blockquote className="font-serif text-xl lg:text-2xl italic font-light text-white/80 leading-relaxed">
            &ldquo;{futureVision}&rdquo;
          </blockquote>
        </AnimatedSection>
      </Container>
    </section>
  )
}
