import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { AnimatedSection, Container } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

/* ── Diagram constants ─────────────────────────────────────── */
const CX = 260, CY = 260, ORBIT = 172, NODE_R = 36, HUB_R = 66

const SECTORS = [
  {
    id: 'delivery',
    label: 'DELIVERY',
    angle: -90,
    title: 'Yanct Chain of Hospitals',
    description:
      'A comprehensive network of tertiary care facilities providing specialized surgical, cardiac, and oncology services across East Africa.',
    metric: '900+ Specialized Beds',
    icon: (
      <>
        <path d="M-6,-4 L0,-10 L6,-4 L6,7 L-6,7 Z" fill="none" stroke="white" strokeWidth="1.3" opacity="0.8" />
        <rect x="-2" y="1" width="4" height="6" fill="white" opacity="0.55" />
      </>
    ),
  },
  {
    id: 'financing',
    label: 'FINANCING',
    angle: -30,
    title: 'Micro-Financing & Insurance',
    description:
      'Innovative micro-insurance models tailored for the self-employed and informal sectors, closing the affordability gap in healthcare.',
    metric: 'Pan-African Model',
    icon: (
      <polyline points="-8,6 -3,-5 3,1 8,-8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
    ),
  },
  {
    id: 'education',
    label: 'EDUCATION',
    angle: 30,
    title: 'YLC Health Sciences',
    description:
      'Training the next generation of medical specialists through rigorous academic programs and clinical rotation integration.',
    metric: 'Chief Pipeline Active',
    icon: (
      <>
        <rect x="-8" y="-7" width="16" height="11" rx="1" fill="none" stroke="white" strokeWidth="1.3" opacity="0.8" />
        <line x1="0" y1="4" x2="0" y2="8" stroke="white" strokeWidth="1.3" opacity="0.8" />
        <line x1="-4" y1="8" x2="4" y2="8" stroke="white" strokeWidth="1.3" opacity="0.8" />
      </>
    ),
  },
  {
    id: 'production',
    label: 'PRODUCTION',
    angle: 90,
    title: 'Pharma Manufacturing',
    description:
      'On-shore manufacturing of essential generic medications ensuring supply chain sovereignty and healthcare affordability.',
    metric: 'Supply Secured',
    icon: (
      <>
        <rect x="-8" y="0" width="5" height="8" fill="white" opacity="0.4" />
        <rect x="-2" y="-7" width="5" height="15" fill="white" opacity="0.75" />
        <rect x="5" y="-3" width="5" height="11" fill="white" opacity="0.4" />
      </>
    ),
  },
  {
    id: 'tech',
    label: 'DIGITAL',
    angle: 150,
    title: 'Digital Platforms',
    description:
      'Unified EMR systems and telemedicine portals that connect rural clinics to urban specialists instantly across the region.',
    metric: 'System Active',
    icon: (
      <>
        <rect x="-9" y="-6" width="18" height="12" rx="1" fill="none" stroke="white" strokeWidth="1.3" opacity="0.8" />
        <circle cx="0" cy="0" r="2.5" fill="white" opacity="0.65" />
      </>
    ),
  },
  {
    id: 'research',
    label: 'RESEARCH',
    angle: 210,
    title: 'Medical Research',
    description:
      'Genomic studies and epidemiological research focused on local populations, driving evidence-based regional care.',
    metric: 'Signal Active',
    icon: (
      <>
        <circle cx="0" cy="-6" r="4" fill="none" stroke="white" strokeWidth="1.3" opacity="0.8" />
        <path d="M-7,8 C-7,1 -3,-1 0,-1 C3,-1 7,1 7,8" fill="none" stroke="white" strokeWidth="1.3" opacity="0.8" />
      </>
    ),
  },
]

/* ── Component ─────────────────────────────────────────────── */
export default function EcosystemNetworkSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeId, setActiveId] = useState<string>(SECTORS[0]!.id)
  const { content } = useSiteContent()
  const section = content?.sections.liyana_framework
  const ecosystem = (section?.metadata?.ecosystem || {}) as any
  const network = ecosystem.network || {}
  const hero = network.hero || {}
  const sectors: any[] = Array.isArray(network.sectors) && network.sectors.length > 0 ? network.sectors : SECTORS
  const nodes = sectors.map((s: any) => ({
    ...s,
    x: CX + ORBIT * Math.cos((s.angle * Math.PI) / 180),
    y: CY + ORBIT * Math.sin((s.angle * Math.PI) / 180),
  }))

  const activeNode = nodes.find((n) => n.id === activeId) ?? nodes[0]!

  return (
    <section ref={ref} className="py-14 bg-ink relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] bg-teal/10" />
      </div>

      <Container className="relative z-10">
        {/* Section header */}
        <AnimatedSection className="text-center mb-10">
          <div className="section-header justify-center mb-6">
            <span className="section-rule !bg-white/10" />
            <span className="section-tag !text-teal">{hero.tag || 'System Generated'}</span>
            <span className="section-rule !bg-white/10" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white">
            {hero.title || 'The Ecosystem Core'}
          </h2>
          <p className="mt-4 text-sm font-light text-white/50 max-w-md mx-auto leading-relaxed">
            {hero.description ||
              'Six interconnected sectors — each reinforcing the next — forming a single, self-sustaining healthcare chain.'}
          </p>
        </AnimatedSection>

        {/* Two-column interactive layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── Left: SVG Diagram ───────────────────────────── */}
          <div className="lg:col-span-7">
            <svg
              viewBox="0 0 520 520"
              className="w-full max-w-lg mx-auto"
              aria-label="Ecosystem network diagram"
            >
              <defs>
                {/* Hub glow filter */}
                <filter id="hub-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Node glow filter */}
                <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Gradient for each spoke */}
                {nodes.map((n: any) => (
                  <linearGradient
                    key={`grad-${n.id}`}
                    id={`grad-${n.id}`}
                    x1={CX} y1={CY} x2={n.x} y2={n.y}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="var(--color-teal-mid)" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="var(--color-teal-mid)" stopOpacity="0.08" />
                  </linearGradient>
                ))}
              </defs>

              {/* ── Rotating outer rings ── */}
              <circle
                cx={CX} cy={CY} r={228}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                strokeDasharray="6 14"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  animation: 'orbit-cw 40s linear infinite',
                }}
              />
              <circle
                cx={CX} cy={CY} r={248}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
                strokeDasharray="3 10"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  animation: 'orbit-ccw 60s linear infinite',
                }}
              />

              {/* Orbit reference circle (very faint) */}
              <circle
                cx={CX} cy={CY} r={ORBIT}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />

              {/* ── Gradient spoke lines ── */}
              {nodes.map((n: any, i: number) => (
                <motion.path
                  key={`spoke-${n.id}`}
                  d={`M ${CX} ${CY} L ${n.x} ${n.y}`}
                  stroke={`url(#grad-${n.id})`}
                  strokeWidth={activeId === n.id ? 1.5 : 1}
                  fill="none"
                  strokeDasharray="300"
                  initial={{ strokeDashoffset: 300, opacity: 0 }}
                  animate={inView ? { strokeDashoffset: 0, opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                />
              ))}

              {/* ── Traveling dots along spokes ── */}
              {inView && nodes.map((n: any, i: number) => (
                <motion.circle
                  key={`dot-${n.id}`}
                  r={2.5}
                  fill="var(--color-teal-mid)"
                  initial={{ cx: CX, cy: CY, opacity: 0 }}
                  animate={{
                    cx: [CX, n.x],
                    cy: [CY, n.y],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    delay: i * 0.55,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* ── Pulsing rings from hub ── */}
              {inView && [0, 1, 2].map((ring) => (
                <motion.circle
                  key={`pulse-${ring}`}
                  cx={CX} cy={CY}
                  fill="none"
                  stroke="var(--color-teal)"
                  strokeWidth="1"
                  initial={{ r: HUB_R + 4, opacity: 0 }}
                  animate={{ r: HUB_R + 55, opacity: [0, 0.35, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: ring * 1,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* ── Center hub ── */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 140 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                filter="url(#hub-glow)"
              >
                {/* Outer ring of hub */}
                <circle cx={CX} cy={CY} r={HUB_R + 10} fill="var(--color-teal)" fillOpacity="0.12" stroke="var(--color-teal-mid)" strokeOpacity="0.2" strokeWidth="1" />
                {/* Main hub */}
                <circle cx={CX} cy={CY} r={HUB_R} fill="var(--color-teal)" />
                <circle cx={CX} cy={CY} r={HUB_R - 7} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                {/* Asterisk spokes */}
                {[0, 60, 120].map((a) => (
                  <line
                    key={a}
                    x1={CX + 20 * Math.cos((a * Math.PI) / 180)}
                    y1={CY + 20 * Math.sin((a * Math.PI) / 180)}
                    x2={CX - 20 * Math.cos((a * Math.PI) / 180)}
                    y2={CY - 20 * Math.sin((a * Math.PI) / 180)}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))}
                <circle cx={CX} cy={CY} r={5} fill="rgba(255,255,255,0.85)" />
                {/* Hub labels */}
                <text x={CX} y={CY + HUB_R - 17} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace" letterSpacing="1.5">INTEGRATED</text>
                <text x={CX} y={CY + HUB_R - 8}  textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace" letterSpacing="1.5">HEALTHCARE</text>
              </motion.g>

              {/* ── Outer nodes ── */}
              {nodes.map((n: any, i: number) => {
                const isActive = n.id === activeId
                return (
                  <motion.g
                    key={n.id}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.09, type: 'spring', stiffness: 180 }}
                    style={{ cursor: 'pointer', transformBox: 'fill-box', transformOrigin: 'center' }}
                    onClick={() => setActiveId(n.id)}
                    filter={isActive ? 'url(#node-glow)' : undefined}
                  >
                    {/* Glow halo for active node */}
                    {isActive && (
                      <circle cx={n.x} cy={n.y} r={NODE_R + 14} fill="var(--color-teal-mid)" fillOpacity="0.15" stroke="var(--color-teal-mid)" strokeOpacity="0.3" strokeWidth="1" />
                    )}
                    {/* Node circle */}
                    <circle
                      cx={n.x} cy={n.y} r={NODE_R}
                      fill={isActive ? 'var(--color-teal-mid)' : 'rgba(255,255,255,0.04)'}
                      fillOpacity={isActive ? 0.25 : 1}
                      stroke={isActive ? 'var(--color-teal-mid)' : 'rgba(255,255,255,0.18)'}
                      strokeOpacity={isActive ? 0.8 : 1}
                      strokeWidth={isActive ? 1.5 : 1}
                    />
                    {/* Icon */}
                    <g transform={`translate(${n.x}, ${n.y})`}>{n.icon}</g>
                    {/* Label */}
                    <text
                      x={n.x}
                      y={n.y + NODE_R + 16}
                      textAnchor="middle"
                      fill={isActive ? 'var(--color-teal-mid)' : 'rgba(255,255,255,0.35)'}
                      fillOpacity={isActive ? 0.9 : 1}
                      fontSize="7.5"
                      fontFamily="monospace"
                      letterSpacing="2"
                    >
                      {n.label}
                    </text>
                  </motion.g>
                )
              })}
            </svg>
          </div>

          {/* ── Right: Interactive sector list ──────────────── */}
          <div className="lg:col-span-5">
            <AnimatedSection delay={0.3}>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/30 mb-6">
                Select a sector
              </p>

              <div className="space-y-1">
                {nodes.map((n: any, i: number) => {
                  const isActive = n.id === activeId
                  return (
                    <button
                      key={n.id}
                      onClick={() => setActiveId(n.id)}
                      className={`w-full text-left flex items-center gap-4 px-4 py-4 transition-all duration-300 border-l-2 group
                        ${isActive
                          ? 'border-teal bg-white/5'
                          : 'border-transparent hover:border-white/20 hover:bg-white/3'
                        }`}
                    >
                      <span className={`font-mono text-[9px] tracking-widest shrink-0 transition-colors duration-200
                        ${isActive ? 'text-teal' : 'text-white/25 group-hover:text-white/40'}`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`font-mono text-[9px] tracking-[0.2em] uppercase transition-colors duration-200
                        ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}
                      >
                        {n.label}
                      </span>
                      <span className={`flex-1 text-right font-serif text-sm font-light transition-colors duration-200
                        ${isActive ? 'text-white/80' : 'text-white/20 group-hover:text-white/30'}`}
                      >
                        {n.title}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Active sector detail panel */}
              <div className="mt-8 border-t border-white/10 pt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal bg-teal/10 px-3 py-1">
                        {activeNode.label}
                      </span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <h3 className="font-serif text-2xl font-light text-white mb-3">
                      {activeNode.title}
                    </h3>
                    <p className="text-sm font-light text-white/55 leading-relaxed mb-6">
                      {activeNode.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-px bg-teal shrink-0" />
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal/80">
                        {activeNode.metric}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </AnimatedSection>
          </div>

        </div>
      </Container>
    </section>
  )
}
