interface HealthcareChatIconProps {
  size?: number
  className?: string
  variant?: 'badge' | 'simple'
}

export function HealthcareChatIcon({
  className,
}: HealthcareChatIconProps) {
  return (
    <img
      src="/image.png"
      alt="AI Assistant"
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}

export default HealthcareChatIcon
