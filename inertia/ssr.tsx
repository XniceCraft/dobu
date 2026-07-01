import { client } from '@/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { BottleProvider } from './providers/bottle-provider'
import { Toaster } from 'react-hot-toast'
import ReactDOMServer from 'react-dom/server'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true })
      )
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <BottleProvider>
            <App {...props} />
            <Toaster position="top-right" />
          </BottleProvider>
        </TuyauProvider>
      )
    },
  })
}
