import { Link } from 'react-router-dom'
import { AnimatedSection, Container, Button } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function EcosystemBreakdownSection() {
  const { content } = useSiteContent()
  const section = content?.sections.liyana_framework
  const ecosystem = (section?.metadata?.ecosystem || {}) as any
  const breakdown = ecosystem.breakdown || {}
  const sectors: Array<{
    num: string
    category: string
    title: string
    description: string
    stats: string[]
    image: string | null
    accent: boolean
  }> = Array.isArray(breakdown.sectors) && breakdown.sectors.length > 0 ? breakdown.sectors : [
    {
      num: '01',
      category: 'Delivery',
      title: 'Yanct Chain of Hospitals',
      description:
        'A comprehensive network of tertiary care facilities providing specialized surgical, cardiac, and oncology services across East Africa.',
      stats: ['900+ Specialized Beds', 'Pan-African Medical Hub'],
      image: null,
      accent: false,
    },
    {
      num: '02',
      category: 'Education',
      title: 'YLC Health Sciences',
      description:
        'Training the next generation of medical specialists through rigorous academic programs and clinical rotation integration.',
      stats: ['Chief Pipeline Under Development'],
      image: null,
      accent: false,
    },
    {
      num: '03',
      category: 'Manufacturing',
      title: 'Pharma Production',
      description:
        'On-shore manufacturing of essential generic medications to ensure supply chain sovereignty and healthcare affordability.',
      stats: [],
      image: '/lab-connect.png',
      accent: false,
    },
    {
      num: '04',
      category: 'Research',
      title: 'Medical Research',
      description:
        'Genomic studies and epidemiological research focused on local populations, driving evidence-based regional care.',
      stats: ['Signal Active', 'Liyana Research v3.0'],
      image: null,
      accent: true,
    },
    {
      num: '05',
      category: 'Technology',
      title: 'Digital Platforms',
      description:
        'Unified EMR systems and telemedicine portals that connect rural clinics to urban specialists instantly.',
      stats: ['Normal Rate'],
      image: null,
      accent: false,
    },
  ]
  const financing: {
    num: string
    category: string
    title: string
    description: string
  } =
    breakdown.financing || {
      num: '06',
      category: 'Financing',
      title: 'Micro-Financing & Insurance',
      description:
        'Closing the loop by making healthcare accessible. Our financing wing provides innovative micro-insurance models tailored for the self-employed and informal sectors.',
    }

  return (
    <section className="py-14 bg-paper relative overflow-hidden">
      {/* Ambient accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute bottom-0 -right-10 w-[350px] h-[350px] rounded-full blur-[90px] bg-teal-light" />
      </div>

      <Container className="relative z-10">
        {/* Section header */}
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">{breakdown.tag || 'Sector Breakdown'}</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-3">
            {breakdown.title || 'Six sectors. One vision.'}
          </h2>
          <p className="text-sm font-light text-ink-mid leading-relaxed max-w-xl mb-8">
            {breakdown.description ||
              'Every sector of Liyana Healthcare is designed to reinforce the others — creating a self-sustaining, vertically integrated system that delivers care from lab to bedside.'}
          </p>
        </AnimatedSection>

        {/* Sector manifest list */}
        <div className="border-t border-rule divide-y divide-rule">
          {sectors.map((sector, i: number) => (
            <AnimatedSection key={sector.num} delay={i * 0.08}>
              <div
                className={`py-5 md:py-7 grid md:grid-cols-12 gap-6 items-start group px-4 transition-colors duration-300
                  ${sector.accent
                    ? 'bg-teal/5 hover:bg-teal/10'
                    : 'hover:bg-paper-warm/60'
                  }`}
              >
                {/* Col 1: number + badge */}
                <div className="md:col-span-2 flex items-center md:flex-col md:items-start gap-3">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold">
                    {sector.num}
                  </span>
                  <span className={sector.accent ? 'badge-teal' : 'badge-gold'}>
                    {sector.category}
                  </span>
                </div>

                {/* Col 2: title + description */}
                <div className="md:col-span-6 relative">
                  {/* Hover top accent line */}
                  <div className={`absolute -top-1 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300
                    ${sector.accent
                      ? 'bg-gradient-to-r from-teal to-teal-mid'
                      : 'bg-gradient-to-r from-gold to-gold/50'
                    }`}
                  />
                  <h3 className={`font-serif text-xl font-light mb-2 transition-colors duration-300 group-hover:text-teal
                    ${sector.accent ? 'text-teal' : 'text-ink'}`}
                  >
                    {sector.title}
                  </h3>
                  <p className="text-sm font-light text-ink-mid leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                {/* Col 3: stats or image */}
                <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
                  {sector.image ? (
                    <div className="w-full md:w-48 border border-rule overflow-hidden h-24">
                      <img
                        src={sector.image}
                        alt={sector.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  ) : (
                    sector.stats.map((s: string) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className={`w-3 h-px shrink-0 ${sector.accent ? 'bg-teal' : 'bg-gold'}`} />
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-muted">
                          {s}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Financing — dark featured callout */}
        <AnimatedSection delay={0.15}>
          <div className="mt-px bg-ink text-white p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center relative overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full blur-[60px] bg-teal" />
            </div>

            {/* Number + badge */}
            <div className="md:col-span-2 relative z-10 flex md:flex-col items-start gap-3">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold">
                {financing.num}
              </span>
              <span className="badge-gold">{financing.category}</span>
            </div>

            {/* Title + description */}
            <div className="md:col-span-7 relative z-10">
              <h3 className="font-serif text-2xl md:text-3xl font-light text-white mb-3">
                {financing.title}
              </h3>
              <p className="text-sm font-light text-white/60 leading-relaxed">
                {financing.description}
              </p>
            </div>

            {/* CTA */}
            <div className="md:col-span-3 relative z-10 flex md:justify-end">
              <Link to="/foundation">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-teal text-white hover:bg-teal-mid whitespace-nowrap transition-colors duration-300"
                >
                  View Model →
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
