import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const sizeStyles: Record<string, string> = {
  sm: 'px-5 py-2.5 text-[11px]',
  md: 'px-7 py-3.5 text-xs',
  lg: 'px-9 py-4.5 text-sm',
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-teal text-white hover:bg-teal-mid active:bg-teal-mid active:scale-[0.98]',
  ghost:
    'bg-transparent text-ink border-[0.5px] border-[var(--color-ink-faint)] hover:bg-paper-warm hover:border-ink-mid active:bg-paper-warm active:scale-[0.98]',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  href,
  onClick,
  className,
  type = 'button',
}: ButtonProps) => {
  const classes = cn(
    'inline-flex items-center justify-center font-sans font-medium tracking-wider uppercase transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
    sizeStyles[size],
    variantStyles[variant],
    className,
  )

  if (href) {
    return <a href={href} className={classes}>{children}</a>
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

export default Button
