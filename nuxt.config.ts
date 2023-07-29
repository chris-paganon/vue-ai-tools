// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "assets/theme/themes/material/material-dark/standard/indigo/theme.scss"
  ],
  build: {
    transpile: ["primevue"]
  }
});