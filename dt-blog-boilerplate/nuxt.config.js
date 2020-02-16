const path = require('path')
import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import yaml from 'js-yaml'
import Mode from 'frontmatter-markdown-loader/mode'
import MarkdownIt from 'markdown-it'
import mip from 'markdown-it-prism'
import matter from 'gray-matter'

/**
 * Global config info in `_config.yml`
 */
let config = {
  /**
   * Application name
   */
  title: "DiscreteTom's Blog Boilderplate",
  root: 'index',
  defaultLanguage: 'en',
  repo: '',
  email: '',
  author: '',
  folderIcon: 'mdi-folder-outline',
  fileIcon: 'mdi-file',
  orderDecider: '#',
  reverse: false
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
 * `tag` => `[path]`
 */
let tagMap = {}
/**
 * The `../content` folder.
 */
let root = loadFolder('../content')
/**
 * Construct pathMap & tagMap, return content tree
 */
function loadFolder(absPath, path = '') {
  // init folderConfig
  let folderConfig = {
    icon: config.folderIcon,
    orderDecider: config.orderDecider,
    title: '',
    reverse: config.reverse
  }
  // update folderConfig if `_config.yml` exists
  let ymlContent = ''
  try {
    // config file is optional
    ymlContent = fs.readFileSync(absPath + '/_config.yml', 'utf8')
  } catch {}
  if (ymlContent) {
    // if config is not a valid yml, throw err
    let t = yaml.safeLoad(ymlContent)
    // update folderConfig
    for (let key in folderConfig) {
      if (t[key]) folderConfig[key] = t[key]
    }
  }
  // construct children
  let children = fs
    .readdirSync(absPath, { withFileTypes: true })
    .filter(dirent => !dirent.name.startsWith('_')) // ignore some dirents
    .map(child => {
      let childRawName = child.name // => 'order-name.suffix'
      let childAbsPath = [absPath, childRawName].join('/') // '../content/rawName1/rawName2'
      let childRawPath = childAbsPath.slice(10) // '/rawName1/rawName2'
      let childOrder = 0
      let childName = childRawName
      // update name and childOrder by orderDecider & file name suffix
      let orderDeciderIndex = childRawName.indexOf(folderConfig.orderDecider)
      if (orderDeciderIndex !== -1) {
        // orderDecider exists
        let t = childRawName.split(folderConfig.orderDecider)
        if (t[0] !== '') {
          childOrder = Number(t[0])
          if (isNaN(childOrder))
            throw new Error(
              `Invalid file name, please check orderDecider: ${absPath}/${childRawName}`
            )
        }
        childName = childRawName.slice(orderDeciderIndex + 1)
      }
      childName = childName.split('.')[0] // remove file name suffix
      let childPath = [path, childName].join('/')
      let ret = {
        isDir: child.isDirectory(),
        icon: '', // will be overwritten below
        name: childName, // in path
        rawName: childRawName, // 'order-name.suffix'
        title: '', // for display, will be overwritten below.
        children: [], // will be overwritten below
        order: childOrder,
        absPath: childAbsPath,
        rawPath: childRawPath,
        path: childPath
      }
      if (child.isDirectory()) {
        // if this child is a folder
        let t = loadFolder(childAbsPath, childPath)
        ret.icon = t.icon
        ret.title = t.title || childName
        ret.children = t.children
      } else {
        // this child is not a folder
        // get markdown attributes
        let attributes = matter(fs.readFileSync(childAbsPath).toString()).data
        // get tags
        if (attributes.tags)
          attributes.tags.map(tag => {
            if (tagMap[tag]) tagMap[tag].push(childPath)
            else tagMap[tag] = [childPath]
          })
        // update result
        ret.icon = attributes.icon || config.fileIcon
        ret.title = attributes.title || childName
      }
      // update pathMap
      pathMap[ret.path] = ret
      return ret
    })
  children.sort((a, b) =>
    folderConfig.reverse ? b.order - a.order : a.order - b.order
  )
  let result = {
    isDir: true,
    icon: folderConfig.icon,
    rawName: '', // will be overwritten by parent
    name: '', // will be overwritten by parent
    title: folderConfig.title,
    children,
    order: 0, // will be overwritten by parent
    absPath: '../content', // will be overwritten by parent
    rawPath: '/', // will be overwritten by parent
    path: '/' // will be overwritten by parent
  }
  return result
}

/**
 * For `nuxt generate`
 */
let contentRoutes = getContentRoutes('', root.children)
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
    config,
    root,
    pathMap,
    tagMap
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
  pwa: {
    manifest: {
      name: config.title
    }
  },
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
  router: {
    middleware: 'root'
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
    routes: contentRoutes.concat(['/', '/404', '/tags'])
  }
}
