import { AnimatedSection, Container, Card } from '@/components/shared'
import { coreValues } from '@/data/about'

export default function AboutValues() {
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.1}>
              <Card className="bg-white border border-rule h-full">
                <h3 className="font-serif text-xl font-light text-ink mb-3">{value.title}</h3>
                <p className="text-sm font-light text-ink-mid leading-relaxed">{value.description}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
