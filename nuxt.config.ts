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
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],

  // Color mode: force dark để UButton/UBadge dùng đúng màu trên nền tối
  colorMode: {
    preference: 'dark',
    // fallback: 'dark'
  },

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' }
    ],
    defaultLocale: 'en',
    // lazy: true,
    langDir: '../locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    vueI18n: '../i18n/i18n.config.ts'
  },

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
      siteDescription: 'Leading crypto investment platform',
      telegramSupportLink: process.env.TELEGRAM_SUPPORT_LINK || 'https://t.me/ic_gold_support'
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
