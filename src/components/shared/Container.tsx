import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

const Container = ({ children, className, id }: ContainerProps) => {
  return (
    <div
      id={id}
      className={cn(
        'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 xl:px-16',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Container
