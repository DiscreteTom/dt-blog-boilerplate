const path = require('path')
import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import yaml from 'js-yaml'
import Mode from 'frontmatter-markdown-loader/mode'
import MarkdownIt from 'markdown-it'
import mip from 'markdown-it-prism'

/**
 * Global config info in `config.yml`
 */
let config = {
  title: "DiscreteTom's Blog Boilderplate",
  root: 'index.md',
  defaultLanguage: 'en',
  repo: '',
  email: '',
  author: '',
  folderIcon: 'mdi-folder-outline',
  fileIcon: 'mdi-file-outline'
}
let t = yaml.safeLoad(fs.readFileSync('../config.yml', 'utf8')) || {}
for (let key in config) {
  if (t[key]) config[key] = t[key]
}

/**
 * Content tree
 */
let content = loadFolder('../content')
function loadFolder(folder) {
  let ymlContent = ''
  try {
    // config file is optional
    ymlContent = fs.readFileSync(folder + '/config.yml', 'utf8')
  } catch {}
  let folderConfig = []
  // if config is not a valid yml, throw err
  if (ymlContent) folderConfig = yaml.safeLoad(ymlContent)
  // if config is not an array, throw err
  if (!Array.isArray(folderConfig))
    throw new Error(`Invalid file: ${folder}/config.yml`)
  return folderConfig.map(v => {
    // for every active dirent `v`
    let dirent = ''
    let icon = ''
    if (typeof v === 'object') {
      dirent = v.dirent || ''
      icon = v.icon || ''
    } else if (typeof v === 'string') {
      dirent = v
    }
    // if invalid dirent
    if (dirent === '')
      throw new Error(`Invalid value in ${folder}/config.yml: ${v}`)
    // judge folder and get icon
    let isDir = fs.lstatSync(folder + '/' + dirent).isDirectory()
    if (isDir) icon = icon || config.folderIcon
    else icon = icon || config.fileIcon
    // construct result
    let result = {
      isDir,
      icon,
      name: dirent,
      children: []
    }
    // load sub-folder
    if (isDir) result.children = loadFolder(folder + '/' + dirent)
    return result
  })
}

/**
 * Markdown renderer
 */
const md = new MarkdownIt({
  html: true,
  typographer: true
})
md.use(mip)

export default {
  env: {
    content,
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
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        include: path.resolve(__dirname, 'contents'),
        options: {
          mode: [Mode.VUE_RENDER_FUNCTIONS, Mode.VUE_COMPONENT],
          markdown(body) {
            return md.render(body)
          }
        }
      })
    }
  }
}
