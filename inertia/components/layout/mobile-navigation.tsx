import { usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { HouseIcon, TShirtIcon, type Icon } from '@phosphor-icons/react'
import { BottleIcon } from '@/components/icon/bottle-icon'
import { Link } from '@adonisjs/inertia/react'
import { cn } from '@/lib/utils'
import { urlFor } from '@/client'

import type { ComponentType } from 'react'

const routes: {
  route: Parameters<typeof urlFor>[0]
  label: string
  icon: ComponentType | Icon
}[] = [
  {
    route: 'device',
    label: 'Perangkat',
    icon: BottleIcon,
  },
  {
    route: 'home',
    label: 'Beranda',
    icon: HouseIcon,
  },
  {
    route: 'dress',
    label: 'Pakaian',
    icon: TShirtIcon,
  },
]

export function MobileNavigation() {
  const currentUrl = usePage().url

  return (
    <div className="relative">
      <nav className="bg-white max-w-96 w-full mx-auto px-5 pt-3 pb-1 rounded-t-[3rem] flex justify-between shadow-[0px_-1px_0px_#71afcd,0px_-2px_0px_#71afcd,0px_-3px_0px_#71afcd]">
        {routes.map((route) => (
          <Button
            key={route.label}
            variant="ghost"
            className={cn(
              'size-18 flex-col text-xs rounded-xl relative',
              currentUrl === urlFor(route.route)
                ? 'text-white bg-sky-400 hover:bg-sky-500 hover:text-white'
                : 'text-gray-500'
            )}
            asChild
          >
            <Link route={route.route}>
              {currentUrl === urlFor(route.route) && (
                <img
                  className="absolute w-20 top-0 left-1/2 z-1 -translate-1/2"
                  src="/assets/image/droplet.webp"
                  alt="Droplet"
                />
              )}
              <route.icon
                weight="fill"
                className={cn('size-8', currentUrl === urlFor(route.route) && 'z-1')}
              />
              <span className={cn(currentUrl === urlFor(route.route) && 'z-1')}>{route.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}
