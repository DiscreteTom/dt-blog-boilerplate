<template>
  <div>
    <v-breadcrumbs :items="navs" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
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

export default {
  components: { Markdown, Folder },
  data() {
    return {
      navs: [],
      content: process.env.content
    }
  },
  methods: {
    // calculate `this.navs`, `this.context`, `this.isDir`, `this.rawPath`
    init() {
      this.navs = [{ text: '', href: '/' }]
      let paths = this.$route.params.pathMatch.split('/')
      let context = this.content
      let result = []
      let isDir = false
      for (let i = 0; i < paths.length; ++i) {
        let notFound = true
        for (let j = 0; j < context.length; ++j) {
          if (paths[i] == context[j].name) {
            result.push(context[j].rawName)
            this.navs.push({
              text: context[j].name,
              to: '/' + paths.slice(0, i + 1).join('/'),
              exact: true,
              disabled: i == paths.length - 1 // disable the last link
            })
            // get this.isDir
            isDir = context[j].isDir
            // refresh context
            context = context[j].children
            notFound = false
            break
          }
        }
        if (notFound) return // TODO: goto 404
      }
      // change state
      if (isDir) this.$store.commit('showFolder', context)
      else this.$store.commit('showMarkdown', result.join('/'))
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route: 'init'
  }
}
</script>
