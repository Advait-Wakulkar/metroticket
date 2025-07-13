export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  ssr: false,
  app: {
    baseURL: '/metroticket/'
  },
  css: ['~/assets/css/main.css']
})