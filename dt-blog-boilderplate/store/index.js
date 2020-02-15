export default {
  state() {
    return {
      config: process.env.config,
      content: process.env.content,
      navs: [], // displayed in layouts/default.vue
      isDir: false, // whether current page is a directory
      rawPath: '', // markdown file raw path if current page is a markdown
      context: [] // folder info if current page is a directory
    }
  },
  mutations: {
    showMarkdown(state, rawPath) {
      state.isDir = false
      state.rawPath = rawPath
    },
    showFolder(state, context) {
      state.isDir = true
      state.context = context
    },
    setNavs(state, navs){
      state.navs = navs
    }
  }
}
