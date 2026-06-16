import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  tag: string
  title?: string
  className?: string
}

const SectionHeader = ({ tag, title, className }: SectionHeaderProps) => {
  return (
    <div className={cn(className)}>
      <div className="mb-6 flex items-center gap-5">
        <span className="font-mono text-xs tracking-[0.15em] text-teal uppercase">
          {tag}
        </span>
        <div className="h-px flex-1 bg-rule" />
      </div>
      {title && (
        <h2 className="font-serif text-[clamp(28px,3vw,44px)] font-light leading-tight text-ink">
          {title}
        </h2>
      )}
    </div>
  )
}

export default SectionHeader
