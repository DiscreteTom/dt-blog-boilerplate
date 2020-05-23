const path = require('path')
import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import yaml from 'js-yaml'
import Mode from 'frontmatter-markdown-loader/mode'
import MarkdownIt from 'markdown-it'
import mip from 'markdown-it-prism'
import mia from 'markdown-it-anchor'
import matter from 'gray-matter'
import toc from 'markdown-toc'
import uslug from 'uslug'

import loadLanguages from 'prismjs/components/'
loadLanguages()

/**
 * Global config info in `_config.yml`
 */
let config = {
  /**
   * Application name
   */
  title: "DiscreteTom's Blog Boilderplate",
  root: 'index',
  repo: '',
  email: '',
  author: '',
  folderIcon: 'mdi-folder-outline',
  fileIcon: 'mdi-file',
  orderDecider: '@',
  reverse: false,
  description: ''
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
    reverse: config.reverse,
    description: '',
    tags: [],
    img: ''
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
    .filter(dirent => !dirent.name.startsWith('_')) // ignore dirents starts with `_`
    .map(child => {
      let childRawName = child.name // => 'order@name.suffix'
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
              `Invalid file name, please check the orderDecider of: ${childRawPath}`
            )
        }
        childName = childRawName.slice(orderDeciderIndex + 1)
      }
      childName = childName.split('.')[0] // remove file name suffix
      let childPath = [path, childName].join('/')
      let ret = {
        isDir: child.isDirectory(),
        icon: '', // will be overwrote below
        name: childName, // in path
        rawName: childRawName, // 'order@name.suffix'
        title: '', // for display, will be overwrote below.
        order: childOrder,
        absPath: childAbsPath,
        rawPath: childRawPath,
        path: childPath,
        description: '', // if current is a folder, will be overwrote below
        img: '', // will be overwrote below
        tags: [], // will be overwrote below
        children: [] // will be overwrote below
      }
      if (child.isDirectory()) {
        // if this child is a folder
        let t = loadFolder(childAbsPath, childPath)
        ret.icon = t.icon
        ret.title = t.title || childName
        ret.children = t.children
        ret.description = t.description || ret.title
        ret.img = t.img
        ret.tags = t.tags
      } else {
        // this child is not a folder
        // get markdown attributes
        let mdFileContent = fs.readFileSync(childAbsPath).toString()
        let attributes = matter(mdFileContent).data
        // update result
        ret.icon = attributes.icon || config.fileIcon
        ret.title = attributes.title || childName
        ret.description = attributes.description || ret.title
        ret.img = attributes.img
        ret.tags = attributes.tags || []
        ret.toc = attributes.toc == null ? true : attributes.toc
        // get toc
        if (ret.toc) {
          ret.children = toc(mdFileContent).json
          // get max level
          let maxLvl = 0
          let minLvl = 0
          ret.children.map(child => {
            if (child.lvl > maxLvl) maxLvl = child.lvl
            if (!minLvl || child.lvl < minLvl) minLvl = child.lvl
          })
          // fix children level
          if (maxLvl == minLvl) {
            // if all children have the same level
            // consider them as level 2 to optimize ui
            ret.children = ret.children.map(child => {
              child.lvl = 2
              return child
            })
          } else {
            // if children have many different levels
            // make sure children levels start from 1
            ret.children = ret.children.map(child => {
              child.lvl = child.lvl - minLvl + 1
              return child
            })
          }
        }
      }
      // update tagMap
      ret.tags.map(tag => {
        if (tagMap[tag]) tagMap[tag].push(ret.path)
        else tagMap[tag] = [ret.path]
      })
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
    order: 0, // will be overwritten by parent
    absPath: '../content', // will be overwritten by parent
    rawPath: '/', // will be overwritten by parent
    path: '/', // will be overwritten by parent
    description: folderConfig.description,
    img: folderConfig.img,
    tags: folderConfig.tags,
    children
  }
  return result
}

/**
 * For `nuxt generate`
 */
let contentRoutes = []
for (let key in pathMap) {
  contentRoutes.push(key)
}
let tagsRoutes = (function() {
  let result = []
  for (let key in tagMap) {
    result.push('/tags/' + key)
  }
  return result
})()

/**
 * Markdown renderer
 */
const md = new MarkdownIt({
  html: true,
  typographer: true
})
const uslugify = s => uslug(s)
md.use(mip, {
  defaultLanguage: 'bash'
}).use(mia, { slugify: uslugify })

export default {
  env: {
    config,
    root,
    pathMap,
    tagMap
  },
  mode: 'universal',
  head: {
    titleTemplate: '%s - ' + config.title,
    title: config.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: config.description || config.title
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: { color: 'gray', throttle: 50 },
  css: [
    '@/assets/prettier-scroll-bar.less',
    '@/assets/github.css',
    '@/assets/prism.min.css'
  ],
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
    meta: {
      name: config.title,
      author: config.author,
      description: config.description
    },
    manifest: {
      name: config.title
    },
    workbox: {
      cacheOptions: {
        cacheId: config.title
      }
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
    treeShake: true
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
    routes: contentRoutes.concat(['/', '/404', '/tags']).concat(tagsRoutes)
  }
}
