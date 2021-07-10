const path = require('path')
import Mode from 'frontmatter-markdown-loader/mode'
import { config, dangerouslyDisableSanitizersByTagID } from './utils/config'
import { buildRenderer } from './utils/markdown-renderer'
import {
  root,
  pathMap,
  tagMap,
  contentRoutes,
  tagsRoutes
} from './utils/content'
import { searchRoutes } from './utils/searchable-gen'

export default {
  env: {
    // will be injected to vuex
    config,
    root,
    pathMap,
    tagMap
  },
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: config.headScripts,
    // disable escaped innerHTML, ref: https://vue-meta.nuxtjs.org/api/#dangerouslydisablesanitizersbytagid
    __dangerouslyDisableSanitizersByTagID: dangerouslyDisableSanitizersByTagID
  },
  loading: { color: 'gray', throttle: 200, continuous: true },
  css: [
    '@/assets/prettier-scroll-bar.less',
    '@/assets/github.css',
    '@/assets/prism.min.css',
    '@/assets/dt-blog-boilerplate.less'
  ],
  plugins: [],
  buildModules: ['@nuxtjs/vuetify'],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  pwa: {
    meta: {
      name: config.title,
      author: config.author,
      description: config.description
    },
    manifest: {
      name: config.title,
      short_name: config.title,
      description: config.description
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
    middleware: 'global'
  },
  ssr: false,
  build: {
    babel: { minified: true },
    extend(config, ctx) {
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: 'frontmatter-markdown-loader',
          include: path.resolve(__dirname, '..', 'content'),
          options: {
            mode: [Mode.VUE_RENDER_FUNCTIONS, Mode.VUE_COMPONENT],
            markdown(body) {
              let md = buildRenderer()
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
    routes: contentRoutes
      .concat(tagsRoutes)
      .concat(searchRoutes)
      .concat(['/', '/tags/', '/friends/'])
  },
  target: 'static'
}
