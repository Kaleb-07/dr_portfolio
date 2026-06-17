import { Link } from 'react-router-dom'
import { AnimatedSection, Container, Button } from '@/components/shared'
import { awards } from '@/data/awards'

const featuredAwards = awards.slice(0, 4)

export default function HomeAwards() {
  return (
    <section className="section-padding bg-ink text-white">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag text-teal">Recognition</span>
            <span className="section-rule !bg-white/20" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-12">
            Awards &amp; <em className="text-teal-mid not-italic">honours</em>
          </h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 gap-6">
          {featuredAwards.map((award, i) => (
            <AnimatedSection key={award.id} delay={i * 0.1}>
              <div className="p-6 border border-white/10">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal-mid mb-3">{award.category}</p>
                <h3 className="font-serif text-lg font-light text-white mb-1">{award.title}</h3>
                <p className="text-sm text-white/60 mb-1">{award.organization}</p>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold">{award.year}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/awards-recognition">
            <Button variant="ghost" size="lg" className="border border-white/20 text-white">View All Awards</Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
