const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const appBaseUrl = process.env.NUXT_BASE_URL || (repositoryName ? `/${repositoryName}/` : '/')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: appBaseUrl
  },
  css: ['mapbox-gl/dist/mapbox-gl.css', '~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN ?? '',
      // Base URL of the chatbot/server.js booking API; empty means same-origin (local dev only).
      bookingApiUrl: process.env.NUXT_PUBLIC_BOOKING_API_URL ?? ''
    }
  },
  typescript: {
    strict: true
  }
})
