import { AnimatedSection, Container, Card } from '@/components/shared'
import { impactStories } from '@/data/foundation'

export default function FoundationStoriesSection() {
  return (
    <section className="section-padding bg-paper">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Impact</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
            Stories of <em className="text-teal-mid not-italic">change</em>
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {impactStories.map((story, i) => (
            <AnimatedSection key={story.title} delay={i * 0.15}>
              <Card className="bg-white border border-rule h-full">
                <h3 className="font-serif text-lg font-light text-ink mb-3">{story.title}</h3>
                <p className="text-sm font-light text-ink-mid leading-relaxed mb-4">{story.description}</p>
                <div className="border-rule mb-3" />
                <p className="text-xs text-teal">{story.beneficiary}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
