<template>
  <div v-if="$store.state.ready">
    <BreadCrumbs class="d-flex d-sm-none"></BreadCrumbs>
    <Folder v-show="$store.state.current.isDir"></Folder>
    <Markdown v-show="!$store.state.current.isDir"></Markdown>
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
    // judge redirection, update vuex state
    init() {
      if (this.$route.path == '/') {
        // redirect to the root object
        this.$router.push('/' + this.$store.state.config.root)
        return
      }
      let dirent = this.$store.state.pathMap[this.$route.path]
      if (dirent == null) {
        // redirect to 404
        this.$router.push('/404')
        return
      }
      // update state
      this.$store.commit('setCurrent', dirent)
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
