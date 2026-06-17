import { Link } from 'react-router-dom'
import { AnimatedSection, Container, Button } from '@/components/shared'

const cards = [
  {
    num: '01',
    category: 'DELIVERY',
    title: 'Yanct Chain of Hospitals',
    description:
      'A comprehensive network of tertiary care facilities providing specialized surgical, cardiac, and oncology services across East Africa.',
    stats: ['900+ Specialized Beds', 'Pan-African Medical Hub'],
    highlight: false,
    image: null,
  },
  {
    num: '02',
    category: 'EDUCATION',
    title: 'YLC Health Sciences',
    description:
      'Training the next generation of medical specialists through rigorous academic programs and clinical rotation integration.',
    stats: ['Chief Pipeline Under Development'],
    highlight: false,
    image: null,
  },
  {
    num: '03',
    category: 'MANUFACTURING',
    title: 'Pharma Production',
    description:
      'On-shore manufacturing of essential generic medications to ensure supply chain sovereignty and healthcare affordability.',
    stats: [],
    highlight: false,
    image: '/lab-connect.png',
  },
  {
    num: '04',
    category: 'RESEARCH',
    title: 'Medical Research',
    description:
      'Genomic studies and epidemiological research focused on local populations, driving evidence-based regional care.',
    stats: ['Signal Active', 'Liyana Research v3.0'],
    highlight: true,
    image: null,
  },
  {
    num: '05',
    category: 'TECH',
    title: 'Digital Platforms',
    description:
      'Unified EMR systems and telemedicine portals that connect rural clinics to urban specialists instantly.',
    stats: ['Normal Rate'],
    highlight: false,
    image: null,
  },
]

const financingCard = {
  num: '06',
  category: 'FINANCING',
  title: 'Micro-Financing & Insurance',
  description:
    'Closing the loop by making healthcare accessible. Our financing wing provides innovative micro-insurance models tailored for the self-employed and informal sectors.',
}

export default function EcosystemBreakdownSection() {
  return (
    <section className="section-padding bg-paper-warm">
      <Container>
        {/* Row 1: Hospital | Building photo | Education */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-stretch">
          {/* Hospital card */}
          <AnimatedSection>
            <div className="h-full bg-white border border-rule p-6 flex flex-col">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">
                No. {cards[0]!.num} &nbsp;|&nbsp; {cards[0]!.category}
              </p>
              <h3 className="font-serif text-xl font-light text-ink mb-3">{cards[0]!.title}</h3>
              <p className="text-sm font-light text-ink-mid leading-relaxed flex-1">{cards[0]!.description}</p>
              <div className="mt-6 space-y-1">
                {cards[0]!.stats.map(s => (
                  <p key={s} className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-muted flex items-center gap-2">
                    <span className="w-3 h-px bg-teal inline-block" />{s}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Building photo */}
          <AnimatedSection delay={0.06}>
            <div className="h-full min-h-[260px] overflow-hidden border border-rule">
              <img
                src="/lab-connect.png"
                alt="Liyana Healthcare Facility"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </AnimatedSection>

          {/* Education card */}
          <AnimatedSection delay={0.12}>
            <div className="h-full bg-white border border-rule p-6 flex flex-col">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">
                No. {cards[1]!.num} &nbsp;|&nbsp; {cards[1]!.category}
              </p>
              <h3 className="font-serif text-xl font-light text-ink mb-3">{cards[1]!.title}</h3>
              <p className="text-sm font-light text-ink-mid leading-relaxed flex-1">{cards[1]!.description}</p>
              <div className="mt-6">
                {cards[1]!.stats.map(s => (
                  <p key={s} className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-muted">
                    {s}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Row 2: Pharma | Research (teal) | Digital */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-stretch">
          {/* Pharma */}
          <AnimatedSection delay={0.05}>
            <div className="h-full bg-white border border-rule p-6 flex flex-col">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">
                No. {cards[2]!.num} &nbsp;|&nbsp; {cards[2]!.category}
              </p>
              <h3 className="font-serif text-xl font-light text-ink mb-3">{cards[2]!.title}</h3>
              <p className="text-sm font-light text-ink-mid leading-relaxed flex-1">{cards[2]!.description}</p>
              {cards[2]!.image && (
                <div className="mt-4 border border-rule overflow-hidden h-24">
                  <img src={cards[2]!.image} alt="" className="w-full h-full object-cover grayscale" />
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Research — teal highlight */}
          <AnimatedSection delay={0.1}>
            <div className="h-full bg-teal p-6 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal to-teal-mid pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 mb-4">
                  No. {cards[3]!.num} &nbsp;|&nbsp; {cards[3]!.category}
                </p>
                <h3 className="font-serif text-xl font-light text-white mb-3">{cards[3]!.title}</h3>
                <p className="text-sm font-light text-white/75 leading-relaxed flex-1">{cards[3]!.description}</p>
                <div className="mt-6 space-y-1">
                  {cards[3]!.stats.map(s => (
                    <p key={s} className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/40">
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Digital */}
          <AnimatedSection delay={0.15}>
            <div className="h-full bg-white border border-rule p-6 flex flex-col">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">
                No. {cards[4]!.num} &nbsp;|&nbsp; {cards[4]!.category}
              </p>
              <h3 className="font-serif text-xl font-light text-ink mb-3">{cards[4]!.title}</h3>
              <p className="text-sm font-light text-ink-mid leading-relaxed flex-1">{cards[4]!.description}</p>
              <div className="mt-6">
                {cards[4]!.stats.map(s => (
                  <p key={s} className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-muted">
                    {s}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Row 3: Financing — full width */}
        <AnimatedSection delay={0.1}>
          <div className="bg-white border border-rule p-6 flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="flex-1">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">
                No. {financingCard.num} &nbsp;|&nbsp; {financingCard.category}
              </p>
              <h3 className="font-serif text-xl font-light text-ink mb-3">{financingCard.title}</h3>
              <p className="text-sm font-light text-ink-mid leading-relaxed max-w-2xl">
                {financingCard.description}
              </p>
            </div>
            <div className="shrink-0">
              <Link to="/foundation">
                <Button variant="primary" size="lg" className="bg-ink text-white hover:bg-teal whitespace-nowrap transition-colors duration-300">
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
