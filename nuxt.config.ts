// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    "@/assets/styles/variables.css", 
  ],
  modules: [
    // ['@pinia/nuxt', {
    //   autoImports: ['defineStore', 'acceptHMRUpdate']
    // }]
  ],
  routeRules: {
    // "/spa": {ssr: false},
    // "/static": {static: true},
    // "/swr": {swr: false}
  },
  // alias: {
  //   pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs'
  // }
})
 