// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  sourcemap: false,

  nitro: {
    prerender: {
      routes: [
        "/",
        "/css",
        "/json",
        "/html",
        "/python",
        "/cplusplus",
        "/css/0",
        "/css/1",
        "/css/2",
        "/css/3",
        "/html/0",
        "/html/1",
        "/json/0",
        "/json/1",
        "/python/0",
        "/python/1",
        "/python/2",
        "/cplusplus/0",
        "/cplusplus/1",
      ]
    }
  },

  app: {
    head: {
      title: 'Nuxty typing'
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-shiki'
  ],

  shiki: {
    bundledLangs: ['css', 'python', 'cpp', 'json', 'html'],
    bundledThemes: ['one-dark-pro']
  }
})
