import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { EcosystemNode, EcosystemConnection, EcosystemCategory } from '@/types'

interface EcosystemMapProps {
  nodes: EcosystemNode[]
  connections: EcosystemConnection[]
}

const categoryColors: Record<EcosystemCategory, string> = {
  hospital: 'bg-blue-600',
  diagnostics: 'bg-purple-600',
  education: 'bg-emerald-600',
  research: 'bg-cyan-600',
  manufacturing: 'bg-amber-600',
  'digital-health': 'bg-violet-600',
  insurance: 'bg-rose-600',
  'community-services': 'bg-teal-600',
}

const categoryLabels: Record<EcosystemCategory, string> = {
  hospital: 'Hospital',
  diagnostics: 'Diagnostics',
  education: 'Education',
  research: 'Research',
  manufacturing: 'Manufacturing',
  'digital-health': 'Digital Health',
  insurance: 'Insurance',
  'community-services': 'Community Services',
}

const EcosystemMap = ({ nodes, connections }: EcosystemMapProps) => {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const connectedIds = selectedNode
    ? new Set([
        selectedNode.id,
        ...connections
          .filter(
            (c) => c.source === selectedNode.id || c.target === selectedNode.id,
          )
          .flatMap((c) => [c.source, c.target]),
      ])
    : null

  return (
    <div className="relative">
      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-3">
        {(Object.entries(categoryLabels) as [EcosystemCategory, string][]).map(
          ([key, label]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 text-xs text-[--color-text-secondary]"
            >
              <span
                className={cn(
                  'inline-block h-2.5 w-2.5 rounded-full',
                  categoryColors[key],
                )}
              />
              {label}
            </span>
          ),
        )}
      </div>

      {/* Starburst Layout */}
      <div className="relative mx-auto flex h-[600px] max-w-4xl items-center justify-center">
        {/* Connection Lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {connections.map((conn) => {
            const source = nodes.find((n) => n.id === conn.source)
            const target = nodes.find((n) => n.id === conn.target)
            if (!source || !target) return null

            const sourceAngle =
              (nodes.indexOf(source) / nodes.length) * 360
            const targetAngle =
              (nodes.indexOf(target) / nodes.length) * 360

            const centerX = 50
            const centerY = 50
            const radius = 40
            const sx =
              centerX +
              radius * Math.cos((sourceAngle * Math.PI) / 180)
            const sy =
              centerY +
              radius * Math.sin((sourceAngle * Math.PI) / 180)
            const tx =
              centerX +
              radius * Math.cos((targetAngle * Math.PI) / 180)
            const ty =
              centerY +
              radius * Math.sin((targetAngle * Math.PI) / 180)

            const isActive =
              !connectedIds ||
              (connectedIds.has(conn.source) &&
                connectedIds.has(conn.target))
            const isHovered =
              hoveredId === conn.source ||
              hoveredId === conn.target

            return (
              <line
                key={`${conn.source}-${conn.target}`}
                x1={`${sx}%`}
                y1={`${sy}%`}
                x2={`${tx}%`}
                y2={`${ty}%`}
                className={cn(
                  'transition-opacity duration-300',
                  isActive ? 'opacity-20' : 'opacity-5',
                  isHovered && 'opacity-40',
                )}
                stroke="currentColor"
                strokeWidth="1"
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, index) => {
          const angle = (index / nodes.length) * 360
          const radius = 240
          const rad = (angle * Math.PI) / 180
          const x = Math.cos(rad) * radius
          const y = Math.sin(rad) * radius

          const isSelected = selectedNode?.id === node.id
          const isDimmed = connectedIds && !connectedIds.has(node.id)

          return (
            <motion.button
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isDimmed ? 0.4 : 1,
                scale: isSelected ? 1.15 : 1,
                x,
                y,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onHoverStart={() => setHoveredId(node.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() =>
                setSelectedNode(
                  selectedNode?.id === node.id ? null : node,
                )
              }
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              )}
            >
              <div
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg transition-shadow duration-300',
                  categoryColors[node.category] ?? 'bg-gray-600',
                  isSelected && 'ring-4 ring-accent ring-offset-2',
                  hoveredId === node.id && 'shadow-xl',
                )}
              >
                <span className="px-1 text-center leading-tight">
                  {node.name}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'mx-auto mt-8 max-w-2xl rounded-xl border border-[--color-border] bg-white p-6',
            )}
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className={cn(
                  'inline-block h-3 w-3 rounded-full',
                  categoryColors[selectedNode.category],
                )}
              />
              <span className="text-xs font-semibold tracking-wider text-[--color-text-secondary] uppercase">
                {categoryLabels[selectedNode.category]}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[--color-text-primary]">
              {selectedNode.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[--color-text-secondary]">
              {selectedNode.description}
            </p>
            {selectedNode.metrics && selectedNode.metrics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {selectedNode.metrics.map((m, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[--color-neutral] px-3 py-1 text-xs font-medium text-[--color-text-secondary]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
            {selectedNode.link && (
              <a
                href={selectedNode.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Learn more &rarr;
              </a>
            )}
            <button
              onClick={() => setSelectedNode(null)}
              className="mt-4 ml-4 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary]"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EcosystemMap
