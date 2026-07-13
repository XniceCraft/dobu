import { client } from '@/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { BottleProvider } from './providers/bottle-provider'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { Toaster } from 'react-hot-toast'
import ReactDOMServer from 'react-dom/server'

export default function render(page: Parameters<typeof createInertiaApp>[0]['page']) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true }),
        (page: React.ReactElement) => {
          return <BottleProvider>{page}</BottleProvider>
        }
      )
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <NuqsAdapter>
            <App {...props} />
          </NuqsAdapter>
          <Toaster position="top-right" />
        </TuyauProvider>
      )
    },
  })
}
