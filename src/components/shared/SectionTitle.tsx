import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}

const SectionTitle = ({ children, className, as: Tag = 'h2' }: SectionTitleProps) => {
  return (
    <Tag
      className={cn(
        'font-serif text-[clamp(28px,3vw,44px)] font-light leading-tight text-ink',
        '[&_em]:text-teal',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export default SectionTitle
