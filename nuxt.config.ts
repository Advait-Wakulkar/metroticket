export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  ssr: false,
  app: {
    baseURL: '/metro/',
    cdnURL: '/metro/'
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  css: ['~/assets/css/main.css']
})