import { defineConfig } from '@adonisjs/inertia'

const inertiaConfig = defineConfig({
  /**
   * Server-side rendering options.
   */
  ssr: {
    /**
     * Toggle SSR mode for Inertia pages.
     */
    enabled: true,

    /**
     * Entry file used by the SSR server build.
     */
    entrypoint: 'inertia/ssr.tsx',
  },
  rootView: (ctx) => {
    if (ctx.request.matchesRoute(['auth.login', 'auth.signup'])) {
      return 'auth_layout'
    }

    return 'inertia_layout'
  },
})

export default inertiaConfig
