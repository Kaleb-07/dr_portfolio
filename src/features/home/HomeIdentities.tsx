import { Link } from 'react-router-dom'
import { AnimatedSection, Container, Button } from '@/components/shared'
import { identityItems } from '@/constants/site'

export default function HomeIdentities() {
  return (
    <section className="section-padding bg-paper-warm border-t border-b border-rule">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <AnimatedSection>
              <div className="section-header">
                <span className="section-tag">Overview</span>
                <span className="section-rule" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-ink mb-6">
                Dr. Liyana's professional dimensions
              </h2>
              <p className="text-sm font-light text-ink-mid leading-relaxed mb-8">
                Explore the journey and background of a clinician who stepped beyond practice to build clinical chains, educational systems, and national frameworks.
              </p>
              <div className="flex gap-4">
                <Link to="/about">
                  <Button variant="primary" size="lg" className="bg-teal text-white cursor-pointer">Explore Journey</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" size="lg" className="border border-ink-faint text-ink cursor-pointer">Get in Touch</Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-center">
            <AnimatedSection>
              <div className="space-y-0">
                {identityItems.map((item) => (
                  <div key={item.num}>
                    <div className="flex gap-6 py-6">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-teal shrink-0 w-6">
                        {item.num}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-light text-ink">{item.title}</h3>
                        <p className="text-sm text-ink-muted font-light mt-1">{item.detail}</p>
                      </div>
                    </div>
                    <div className="border-b border-rule" />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </section>
  )
}
