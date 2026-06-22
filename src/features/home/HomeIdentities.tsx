import { Link } from 'react-router-dom'
import { AnimatedSection, Container, Button } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function HomeIdentities() {
  const { content } = useSiteContent()
  const section = content?.sections.identity_overview
  const identityItems = content?.identityItems || []

  if (!section) return null

  return (
    <section className="section-padding bg-paper-warm border-t border-b border-rule">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <AnimatedSection>
              <div className="section-header">
                <span className="section-tag">{section.eyebrow}</span>
                <span className="section-rule" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-ink mb-6">
                {section.title}
              </h2>
              <p className="text-sm font-light text-ink-mid leading-relaxed mb-8">
                {section.description}
              </p>
              <div className="flex gap-4">
                {(section.metadata?.cta || []).map((cta) => (
                  <Link key={`${cta.label}-${cta.path}`} to={cta.path}>
                    <Button
                      variant={cta.variant === 'ghost' ? 'ghost' : 'primary'}
                      size="lg"
                      className={
                        cta.variant === 'ghost'
                          ? 'border border-ink-faint text-ink cursor-pointer'
                          : 'bg-teal text-white cursor-pointer'
                      }
                    >
                      {cta.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-center">
            <AnimatedSection>
              <div className="space-y-0">
                {identityItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-6 py-6">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-teal shrink-0 w-6">
                        {item.label}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-light text-ink">{item.title}</h3>
                        <p className="text-sm text-ink-muted font-light mt-1">{item.description}</p>
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
