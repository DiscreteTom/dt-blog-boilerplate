const path = require('path')
import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import yaml from 'js-yaml'
import Mode from 'frontmatter-markdown-loader/mode'
import MarkdownIt from 'markdown-it'
import mip from 'markdown-it-prism'

/**
 * Global config info in `_config.yml`
 */
let config = {
  title: "DiscreteTom's Blog Boilderplate",
  root: 'index',
  defaultLanguage: 'en',
  repo: '',
  email: '',
  author: '',
  folderIcon: 'mdi-folder-outline',
  fileIcon: 'mdi-file',
  orderDecider: '-'
}
let t = yaml.safeLoad(fs.readFileSync('../_config.yml', 'utf8')) || {}
for (let key in config) {
  if (t[key]) config[key] = t[key]
}

/**
 * `path`=>`dirent`
 */
let pathMap = {}
/**
 * Content tree
 */
let content = loadFolder('../content', '')
/**
 * Construct `pathMap` and return content tree with prefix `path` in the `absPath` folder.
 * Ignore dirent with prefix `_`.
 */
function loadFolder(absPath, path) {
  let ymlContent = ''
  try {
    // config file is optional
    ymlContent = fs.readFileSync(absPath + '/_config.yml', 'utf8')
  } catch {}
  let folderConfig = {
    icon: {},
    orderDecider: config.orderDecider
  }
  // get folderConfig
  if (ymlContent) {
    // if config is not a valid yml, throw err
    let t = yaml.safeLoad(ymlContent)
    for (let key in folderConfig) {
      if (t[key]) folderConfig[key] = t[key]
    }
    folderConfig.icon = folderConfig.icon || {}
  }
  // construct result
  let result = fs
    .readdirSync(absPath, { withFileTypes: true })
    .filter(dirent => !dirent.name.startsWith('_'))
    .map(dirent => {
      let isDir = dirent.isDirectory()
      let rawName = dirent.name
      let orderDeciderIndex = rawName.indexOf(folderConfig.orderDecider)
      let order = 0
      let icon = isDir ? config.folderIcon : config.fileIcon
      let name = rawName
      if (orderDeciderIndex !== -1) {
        // orderDecider exists
        let t = rawName.split(folderConfig.orderDecider)
        if (t[0] !== '') {
          order = Number(t[0])
          if (isNaN(order))
            throw new Error(
              `Invalid file name, please check orderDecider: ${absPath}/${rawName}`
            )
        }
        name = rawName.slice(orderDeciderIndex + 1)
      }
      name = name.split('.')[0]
      // update icon
      icon = folderConfig.icon[name] || icon
      let ret = {
        isDir,
        icon,
        rawName,
        name,
        children: [],
        order,
        absPath: [absPath, rawName].join('/'), // '../content/xxx/yyy'
        rawPath: [absPath, rawName].join('/').slice(10), // '/xxx/yyy'
        path: [path, name].join('/')
      }
      // update pathMap
      pathMap[ret.path] = ret
      // load sub-folders
      if (isDir) ret.children = loadFolder(ret.absPath, ret.path)
      return ret
    })
  result.sort((a, b) => a.order - b.order)
  return result
}

/**
 * For `nuxt generate`
 */
let contentRoutes = getContentRoutes('', content)
function getContentRoutes(prefix, context) {
  return context.reduce((result, dirent) => {
    let current = [dirent.name]
    if (dirent.isDir) {
      current = current.concat(getContentRoutes(dirent.name, dirent.children))
    }
    return result.concat(current.map(v => [prefix, v].join('/')))
  }, [])
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
    config,
    pathMap
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
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: 'frontmatter-markdown-loader',
          include: path.resolve(__dirname, '..', 'content'),
          options: {
            mode: [Mode.VUE_RENDER_FUNCTIONS, Mode.VUE_COMPONENT],
            markdown(body) {
              return md.render(body)
            }
          }
        },
        {
          test: /\.ya?ml$/,
          loader: 'json-loader!yaml-loader'
        }
      )
    }
  },
  generate: {
    routes: contentRoutes.concat(['/'])
  }
}
