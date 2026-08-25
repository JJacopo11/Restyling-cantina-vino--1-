const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const appBaseUrl = process.env.NUXT_BASE_URL || (repositoryName ? `/${repositoryName}/` : '/')
const mapboxToken = process.env.NUXT_PUBLIC_MAPBOX_TOKEN?.trim() || 'pk.eyJ1Ijoic3Ryb2JvZmxleCIsImEiOiJjbXQxYnR3aHUwZ240MnhyMnprNWh3eDdoIn0.NmG-ARycoIm0dKhYMWIAig'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: appBaseUrl
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/', '/prenota']
    }
  },
  css: ['mapbox-gl/dist/mapbox-gl.css', '~/assets/css/main.css'],
  build: {
    // Bundle vue-i18n into the server output so Nitro doesn't externalize (and fail to resolve) it.
    transpile: ['vue-i18n']
  },
  vite: {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      // Use the full build so vue-i18n can compile the runtime message objects.
      alias: { 'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js' }
    }
  },
  runtimeConfig: {
    public: {
      // Public pk.* token from the original site; override per-env with NUXT_PUBLIC_MAPBOX_TOKEN.
      mapboxToken,
      // Base URL of the chatbot/server.js booking API; empty means same-origin (local dev only).
      bookingApiUrl: process.env.NUXT_PUBLIC_BOOKING_API_URL ?? ''
    }
  },
  typescript: {
    strict: true
  }
})
