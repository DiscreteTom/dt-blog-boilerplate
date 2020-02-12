import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import yaml from 'js-yaml'

/**
 * config info in `config.yml`
 */
let config = {
  title: "DiscreteTom's Blog Boilderplate",
  root: 'index.md',
  defaultLanguage: 'en',
  folderOrderNote: '#',
  github: 'https://github.com/DiscreteTom/dt-blog-boilerplate',
  email: 'discrete_tom@outlook.com'
}
let t = yaml.safeLoad(fs.readFileSync('../config.yml', 'utf8')) || {}
for (let key in config) {
  if (t[key]) config[key] = t[key]
}

/**
 * Sorted by `order`
 */
let contentFolders = fs
  .readdirSync('../content', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .map(foldername => {
    let t = foldername.split(config.folderOrderNote)
    return { title: t[0], order: t.length > 1 ? Number(t[1]) : 0 }
  })
contentFolders.sort((a, b) => a.order - b.order)

export default {
  env: {
    contentFolders,
    config
  },
  mode: 'universal',
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: { color: '#fff' },
  css: [],
  plugins: [],
  buildModules: ['@nuxtjs/vuetify'],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  build: {
    extend(config, ctx) {}
  }
}
