import { cn } from '@/lib/utils'

interface TimelineItem {
  year: string
  title: string
  subtitle: string
  badge?: string
  milestone?: boolean
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const Timeline = ({ items, className }: TimelineProps) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-4 top-2 h-[calc(100%-8px)] w-px bg-rule" />
      <div className="space-y-10">
        {items.map((item, i) => (
          <div key={i} className="relative flex gap-6">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  'relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-teal',
                  item.milestone ? 'bg-teal' : 'bg-paper-warm',
                )}
              />
            </div>
            <div className="flex-1">
              <span className="font-mono text-xs tracking-widest text-teal uppercase">
                {item.year}
              </span>
              {item.badge && (
                <span className="ml-2 inline-block rounded bg-teal/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-teal uppercase">
                  {item.badge}
                </span>
              )}
              <h3 className="mt-1 font-serif text-xl font-semibold leading-snug text-ink">
                {item.title}
              </h3>
              <p className="mt-0.5 font-sans text-sm text-ink-mid">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
