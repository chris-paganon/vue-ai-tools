// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "assets/base.css",
    "assets/utils.css",
    "primeflex/primeflex.css",
    "assets/theme/themes/material/material-dark/standard/indigo/theme.scss"
  ],
  imports: {
    dirs: [
      'composables/stores/**',
    ],
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-primevue',
  ],
  pinia: {
    autoImports: [
      'defineStore',
      'storeToRefs',
    ]
  },
  primevue: {
    usePrimeVue: true,
    options: { 
      ripple: true, 
      inputStyle: 'filled',
    },
    components: {
      include: [
        'Button', 
        'DataTable',
        'Menubar',
        'InputText',
        'Textarea',
        'Password',
        'Dialog',
        'ProgressSpinner',
        'TabMenu',
        'SelectButton',
        'Message',
        'Checkbox',
        'Toast',
      ]
    },
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