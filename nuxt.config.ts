// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: "Nuxty typing"
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
    bundledLangs:["css", "python", "cpp", "json", "html"],
    bundledThemes:["one-dark-pro"]
  }
})