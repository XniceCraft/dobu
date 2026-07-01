import './css/app.css'
import { client } from './client'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { BottleProvider } from './providers/bottle-provider'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { Toaster } from 'react-hot-toast'

const appName = import.meta.env.VITE_APP_NAME

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'))
  },
  setup({ el, App, props }) {
    hydrateRoot(
      el,
      <TuyauProvider client={client}>
        <BottleProvider>
          <App {...props} />
          <Toaster position="top-right" />
        </BottleProvider>
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
