// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    // "primevue/resources/themes/saga-blue/theme.css",
    // "primevue/resources/primevue.css",
    'primeicons/primeicons.css',
    '@/assets/styles/variables.css',
    '@/assets/styles/main.css',
  ],
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
    '@primevue/nuxt-module',
    'nuxt-highcharts',
  ],
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'prime-',
          darkModeSelector: 'system',
          cssLayer: false,
        },
      },
    },
    components: {
      prefix: 'Prime',
    },
  },
  routeRules: {
    // "/spa": {ssr: false},
    // "/static": {static: true},
    // "/swr": {swr: false}
  },
  // alias: {
  //   pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs'
  // }
});
