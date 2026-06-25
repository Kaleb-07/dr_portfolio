import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaBookOpen, FaUsers } from 'react-icons/fa'
import { AnimatedSection, Container, Button } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

const fallbackItems = [
  {
    icon: FaMapMarkerAlt,
    label: 'Community Outreach',
    description: 'Mobile screening units bringing diagnostics to remote regions.',
  },
  {
    icon: FaBookOpen,
    label: 'Education Access',
    description: 'Scholarship funds for aspiring medical technicians and clinical staff.',
  },
  {
    icon: FaUsers,
    label: 'Policy Advocacy',
    description: 'Empowering patient rights and standardizing care ethics.',
  },
]

export default function PublicServiceFoundationSection() {
  const { content } = useSiteContent()
  const section = content?.sections['public-service']
  const items = Array.isArray(section?.metadata?.foundationItems) && section.metadata.foundationItems.length > 0
    ? section.metadata.foundationItems
    : fallbackItems

  return (
    <section className="section-padding bg-paper-warm">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection>
            <div className="relative">
              <div className="border border-rule p-2.5 bg-white shadow-sm">
                <img
                  src="/lab-connect.png"
                  alt="LUCS Foundation"
                  className="w-full grayscale object-cover aspect-[4/5] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <p className="mt-3 font-mono text-[9px] tracking-widest uppercase text-ink-muted">
                Dr. Girma Ababi &mdash; Community Service
              </p>
            </div>
          </AnimatedSection>

          <div>
            <AnimatedSection delay={0.1}>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-teal mb-4">
                The Foundation
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-6">
                Liyana Universal Community Services (LUCS)
              </h2>
              <p className="text-sm font-light text-ink-mid leading-relaxed mb-10">
                Philanthropy is not an afterthought; it is the core of our ecosystem.
                Through LUCS, we dismantle barriers to specialty care and education for underserved populations.
              </p>
            </AnimatedSection>

            <div className="space-y-6 mb-10">
              {items.map((item, i) => {
                const Icon = item.icon || FaMapMarkerAlt
                return (
                  <AnimatedSection key={item.label} delay={0.15 + i * 0.06}>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={13} className="text-teal" />
                      </div>
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm font-light text-ink-mid leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>

            <AnimatedSection delay={0.35}>
              <Link to="/foundation">
                <Button variant="ghost" size="lg" className="border border-rule text-ink hover:border-teal hover:text-teal transition-all duration-300">
                  Support the Mission
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </section>
  )
}
