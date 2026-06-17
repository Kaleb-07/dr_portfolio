import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '@/components/shared'

const CX = 300, CY = 280, ORBIT = 185, NODE_R = 36, HUB_R = 70

const NODES = [
  {
    id: 'delivery', label: 'DELIVERY', angle: -90,
    icon: <><path d="M-6,-4 L0,-10 L6,-4 L6,7 L-6,7 Z" fill="none" stroke="white" strokeWidth="1.3" opacity="0.75"/><rect x="-2" y="1" width="4" height="6" fill="white" opacity="0.5"/></>,
  },
  {
    id: 'financing', label: 'FINANCING', angle: -30,
    icon: <><polyline points="-8,6 -3,-5 3,1 8,-8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.75"/></>,
  },
  {
    id: 'education', label: 'EDUCATION', angle: 30,
    icon: <><rect x="-8" y="-7" width="16" height="11" rx="1" fill="none" stroke="white" strokeWidth="1.3" opacity="0.75"/><line x1="0" y1="4" x2="0" y2="8" stroke="white" strokeWidth="1.3" opacity="0.75"/><line x1="-4" y1="8" x2="4" y2="8" stroke="white" strokeWidth="1.3" opacity="0.75"/></>,
  },
  {
    id: 'production', label: 'PRODUCTION', angle: 90,
    icon: <><rect x="-8" y="0" width="5" height="8" fill="white" opacity="0.4"/><rect x="-2" y="-7" width="5" height="15" fill="white" opacity="0.7"/><rect x="5" y="-3" width="5" height="11" fill="white" opacity="0.4"/></>,
  },
  {
    id: 'tech', label: 'TECH', angle: 150,
    icon: <><rect x="-9" y="-6" width="18" height="12" rx="1" fill="none" stroke="white" strokeWidth="1.3" opacity="0.75"/><circle cx="0" cy="0" r="2.5" fill="white" opacity="0.6"/></>,
  },
  {
    id: 'research', label: 'RESEARCH', angle: 210,
    icon: <><circle cx="0" cy="-6" r="4" fill="none" stroke="white" strokeWidth="1.3" opacity="0.75"/><path d="M-7,8 C-7,1 -3,-1 0,-1 C3,-1 7,1 7,8" fill="none" stroke="white" strokeWidth="1.3" opacity="0.75"/></>,
  },
].map(n => ({
  ...n,
  x: CX + ORBIT * Math.cos(n.angle * Math.PI / 180),
  y: CY + ORBIT * Math.sin(n.angle * Math.PI / 180),
}))

export default function EcosystemNetworkSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding bg-ink relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] bg-teal/8" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-teal mb-4">
            System Generated
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white">
            The Ecosystem <em className="text-teal-mid not-italic">Core</em>
          </h2>
        </motion.div>

        {/* SVG Hub Diagram */}
        <div className="max-w-xl mx-auto">
          <svg viewBox="0 0 600 560" className="w-full" aria-label="Ecosystem network diagram">

            {/* Spoke lines — use path so strokeDashoffset animation works */}
            {NODES.map((n, i) => (
              <motion.path
                key={`line-${n.id}`}
                d={`M ${CX} ${CY} L ${n.x} ${n.y}`}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="300"
                initial={{ strokeDashoffset: 300 }}
                animate={inView ? { strokeDashoffset: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
              />
            ))}

            {/* Center hub */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 160 }}
              style={{ originX: `${CX}px`, originY: `${CY}px` }}
            >
              <circle cx={CX} cy={CY} r={HUB_R} fill="var(--color-teal)" />
              <circle cx={CX} cy={CY} r={HUB_R - 6} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              {/* 6-spoke asterisk icon */}
              {[0,60,120].map(a => (
                <line
                  key={a}
                  x1={CX + 18 * Math.cos(a * Math.PI / 180)}
                  y1={CY + 18 * Math.sin(a * Math.PI / 180)}
                  x2={CX - 18 * Math.cos(a * Math.PI / 180)}
                  y2={CY - 18 * Math.sin(a * Math.PI / 180)}
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
              <circle cx={CX} cy={CY} r={5} fill="rgba(255,255,255,0.8)" />
              {/* Label inside hub */}
              <text x={CX} y={CY + HUB_R - 16} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="7" fontFamily="monospace" letterSpacing="1.5">INTEGRATED</text>
              <text x={CX} y={CY + HUB_R - 7} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="7" fontFamily="monospace" letterSpacing="1.5">HEALTHCARE</text>
            </motion.g>

            {/* Outer nodes */}
            {NODES.map((n, i) => (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.09, type: 'spring', stiffness: 180 }}
                style={{ originX: `${n.x}px`, originY: `${n.y}px` }}
              >
                {/* Node circle */}
                <circle cx={n.x} cy={n.y} r={NODE_R} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                {/* Icon centered in circle */}
                <g transform={`translate(${n.x}, ${n.y})`}>
                  {n.icon}
                </g>
                {/* Label below circle */}
                <text
                  x={n.x}
                  y={n.y + NODE_R + 15}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="8"
                  fontFamily="monospace"
                  letterSpacing="2"
                >
                  {n.label}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>
      </Container>
    </section>
  )
}
