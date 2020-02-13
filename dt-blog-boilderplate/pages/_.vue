<template>
  <div>
    <v-breadcrumbs :items="navs" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <Folder v-if="isDir" :context="context"></Folder>
    <Markdown v-else :rawPath="rawPath"></Markdown>
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
      isDir: false,
      rawPath: '',
      context: [],
      content: process.env.content
    }
  },
  methods: {
    // calculate `this.navs`, `this.context`, `this.isDir`, `this.rawPath`
    init() {
      this.navs = [{ text: '', href: '/' }]
      let paths = this.$route.params.pathMatch.split('/')
      let context = this.content
      let result = ''
      for (let i = 0; i < paths.length; ++i) {
        let notFount = true
        for (let j = 0; j < context.length; ++j) {
          if (paths[i] == context[j].name) {
            result += context[j].rawName
            this.navs.push({
              text: context[j].name,
              href: paths.slice(0, i).join('/') + context[j].name
            })
            // get this.isDir&context
            this.isDir = context[j].isDir
            // refresh context
            context = context[j].children
            this.context = context
            notFount = false
            break
          }
        }
        if (notFount) return '' // TODO: goto 404
      }
      // disable the last nav
      this.navs[this.navs.length - 1].disabled = true
      // judge markdown or folder
      if (!this.isDir) this.rawPath = result
    }
  },
  beforeRouteEnter(from, to, next) {
    next(v => v.init())
  },
  beforeRouteChange() {
    this.init()
  }
}
</script>
