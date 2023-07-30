// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "assets/base.css",
    "primeflex/primeflex.css",
    "assets/theme/themes/material/material-dark/standard/indigo/theme.scss"
  ],
  build: {
    transpile: ["primevue"]
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      openaiOrganization: 'org-AB12',
      openaiApiKey: 'sk-CD34'
    }
  },
});