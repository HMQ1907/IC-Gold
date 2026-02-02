// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable Nuxt 4 future features
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Auto-import composables from app/composables
  imports: {
    dirs: ['composables', 'composables/**']
  },

  // Runtime config
  runtimeConfig: {
    // Server-side only
    resendApiKey: process.env.RESEND_API_KEY,
    
    // Public (available on client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      siteName: 'IC-Gold',
      siteDescription: 'Leading crypto investment platform'
    }
  },

  // App configuration
  app: {
    head: {
      title: 'IC-Gold - Crypto Investment Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'IC-Gold - Leading crypto investment platform' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // TypeScript
  typescript: {
    strict: true
  }
})
