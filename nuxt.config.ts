// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "assets/base.css",
    "assets/utils.css",
    "primeflex/primeflex.css",
    "assets/theme/themes/material/material-dark/standard/indigo/theme.scss"
  ],
  build: {
    transpile: ["primevue"]
  },
  imports: {
    dirs: [
      'composables/stores/**',
    ],
  },
  modules: [
    '@pinia/nuxt',
  ],
  pinia: {
    autoImports: [
      'defineStore',
      'storeToRefs',
    ]
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    openaiOrganization: 'org-AB12',
    openaiApiKey: 'sk-CD34',
    public: {
      pocketbaseUrl: 'http://localhost:8080'
    }
  },
});