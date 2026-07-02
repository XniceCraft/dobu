import { usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ChartBarIcon, FileTextIcon, SignOutIcon, ListIcon, type Icon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { urlFor } from '@/client'
import { useIsMobile } from '@/hooks/use-mobile'

import type { InertiaProps } from '@/types'

type Navigation = {
  label: string
  route: Parameters<typeof urlFor>[0]
  icon: Icon
}

const navigation: Navigation[] = [
  {
    label: 'Dashboard',
    route: 'admin.dashboard',
    icon: ChartBarIcon,
  },
  {
    label: 'Characters',
    route: 'admin.characters.index',
    icon: FileTextIcon,
  },
]

function SidebarContent({ url, props }: { url: string; props: InertiaProps }) {
  return (
    <>
      <div className="border-b border-rule px-6 py-5">
        <p className="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">Admin Panel</p>
        <h2 className="text-lg font-bold tracking-tight text-ink">Dobu</h2>
      </div>

      <div className="flex-1 px-4 py-6">
        <p className="mb-4 px-3.5 font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">
          Navigation
        </p>

        <nav className="space-y-1" aria-label="Admin navigation">
          {navigation.map((item) => {
            const normalizedURL = url.endsWith('/') ? url.substring(0, url.length - 1) : url
            const active = urlFor(item.route) === normalizedURL

            return (
              <Link
                key={item.label}
                route={item.route}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-fast ease-out outline-none',
                  'focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1',
                  'active:translate-y-px active:scale-[0.98]',
                  'disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none',
                  'data-[state=loading]:opacity-70 data-[state=loading]:cursor-wait',
                  'data-[state=error]:text-destructive data-[state=error]:border-destructive',
                  'data-[state=success]:text-accent',
                  active
                    ? 'bg-blue-400 text-accent shadow-sm'
                    : 'text-ink-2 hover:bg-paper-2 hover:text-ink hover:translate-x-0.5'
                )}
              >
                <item.icon size={20} weight="duotone" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-rule p-4">
        <div className="mb-4 rounded-2xl border border-rule bg-paper-2 p-4">
          <p className="text-sm font-semibold text-ink truncate">{props.user!.name}</p>
          <p className="mt-1 text-xs text-ink-3 truncate">{props.user!.email}</p>
        </div>

        <Link
          route="auth.logout"
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-fast ease-out outline-none',
            'focus-visible:outline-2 focus-visible:outline-destructive focus-visible:outline-offset-1',
            'active:translate-y-px active:scale-[0.98]',
            'text-ink-2 hover:bg-destructive/10 hover:text-destructive hover:translate-x-0.5'
          )}
        >
          <SignOutIcon size={20} weight="duotone" />
          Logout
        </Link>
      </div>
    </>
  )
}

export function AdminSidebar() {
  const { url, props } = usePage<InertiaProps>()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button type="button" variant="outline" className="absolute top-4 left-4 z-50">
            <ListIcon size={20} weight="bold" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SidebarContent url={url} props={props} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-rule bg-surface font-sans">
      <SidebarContent url={url} props={props} />
    </aside>
  )
}
