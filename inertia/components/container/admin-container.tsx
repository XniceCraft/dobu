import { cn } from '@/lib/utils'

export function AdminContainer({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('mx-auto w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl space-y-8', className)}
    >
      {children}
    </div>
  )
}
