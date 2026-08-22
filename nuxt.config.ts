export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['mapbox-gl/dist/mapbox-gl.css', '~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN
    }
  },
  typescript: {
    strict: true
  }
})
