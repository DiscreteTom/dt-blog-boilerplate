<template>
  <div>
    <BreadCrumbs class="d-flex d-sm-none"></BreadCrumbs>
    <Folder v-if="$store.state.isDir"></Folder>
    <Markdown v-else></Markdown>
  </div>
</template>

<script>
/**
 * This page will handle all routes.
 * Path info is stored in `this.$route.params.pathMatch`
 */
import Markdown from '~/components/Markdown.vue'
import Folder from '~/components/Folder.vue'
import BreadCrumbs from '~/components/BreadCrumbs.vue'

export default {
  components: { Markdown, Folder, BreadCrumbs },
  data() {
    return {
      content: process.env.content,
      config: process.env.config
    }
  },
  methods: {
    // calculate `this.navs`, `this.context`, `this.isDir`, `this.rawPath`
    init() {
      if (this.$route.params.pathMatch == '') {
        // redirect to the root object
        this.$router.push('/' + this.config.root)
        return
      }
      let navs = []
      let paths = this.$route.params.pathMatch.split('/')
      if (this.$route.params.pathMatch == '')
        // current context is the root object
        paths = [this.config.root]
      let context = this.content
      let result = []
      let isDir = false
      for (let i = 0; i < paths.length; ++i) {
        let notFound = true
        for (let j = 0; j < context.length; ++j) {
          if (paths[i] == context[j].name) {
            result.push(context[j].rawName)
            navs.push({
              text: context[j].name,
              to: '/' + paths.slice(0, i + 1).join('/'),
              exact: true
            })
            // get this.isDir
            isDir = context[j].isDir
            // refresh context
            context = context[j].children
            notFound = false
            break
          }
        }
        if (notFound) {
          this.$router.push('/404')
          return
        }
      }
      // change state
      if (isDir) this.$store.commit('showFolder', context)
      else this.$store.commit('showMarkdown', result.join('/'))
      // if current context == root object, no navs
      if (this.$route.params.pathMatch == '') this.$store.commit('setNavs', [])
      else this.$store.commit('setNavs', navs)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(v => v.init())
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.init()
  }
}
</script>
