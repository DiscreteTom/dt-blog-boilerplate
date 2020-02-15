<template>
  <div>
    <BreadCrumbs class="d-flex d-sm-none"></BreadCrumbs>
    <Folder v-show="$store.state.isDir"></Folder>
    <Markdown v-show="!$store.state.isDir"></Markdown>
  </div>
</template>

<script>
/**
 * This page will handle all routes.
 * Path info is stored in `this.$route.path`
 */
import Markdown from '~/components/Markdown.vue'
import Folder from '~/components/Folder.vue'
import BreadCrumbs from '~/components/BreadCrumbs.vue'

export default {
  components: { Markdown, Folder, BreadCrumbs },
  methods: {
    // calculate `navs`, `context`, `isDir`, `rawPath` in Vuex
    init() {
      if (this.$route.path == '/') {
        // redirect to the root object
        this.$router.push('/' + this.$store.state.config.root)
        return
      }
      let dirent = this.$store.state.pathMap[this.$route.path]
      if (dirent == null) {
        // redirect to 404
        this.$router.puth('/404')
        return
      }
      // change state
      if (dirent.isDir) {
        this.$store.commit('showFolder', dirent.children)
      } else {
        this.$store.commit('showMarkdown', dirent.rawPath)
      }
      this.$store.commit(
        'setNavs',
        dirent.path // => '/xxx/xxx'
          .split('/') // =>['', 'xxx', 'xxx]
          .slice(1) // => ['xxx', 'xxx']
          .reduce(
            (result, name) => {
              result.push({
                text: name,
                exact: true,
                to: [result[result.length - 1].to, name].join('/')
              })
              return result
            },
            [{ text: '', exact: true, to: '' }]
          )
          .slice(1) // remove the '' route
      )
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
