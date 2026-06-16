import { cn } from '@/lib/utils'

type Variant = 'default' | 'bordered' | 'elevated'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: Variant
  hoverable?: boolean
  onClick?: () => void
}

const variantStyles: Record<Variant, string> = {
  default: 'bg-paper-card',
  bordered: 'bg-paper-card border border-rule',
  elevated: 'bg-paper-card shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]',
}

const Card = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  onClick,
}: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-none',
        variantStyles[variant],
        hoverable && 'cursor-pointer transition-all duration-300 hover:bg-paper-warm',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
