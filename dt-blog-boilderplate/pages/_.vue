<template>
  <div>
    <v-breadcrumbs :items="navs" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <Folder v-if="isDir"></Folder>
    <Markdown v-else :rawPath="rawPath"></Markdown>
  </div>
</template>

<script>
/**
 * This page will handle all routes.
 * Path info is stored in `this.$route.params.pathMatch`
 */
import Markdown from '~/components/Markdown.vue'
export default {
  components: { Markdown },
  data() {
    return {
      navs: [],
      isDir: false,
      rawPath: '',
      content: process.env.content
    }
  },
  methods: {
    // calculate `this.navs` and `this.isDir`, return rawPath
    getRawPath() {
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
            // get this.isDir
            this.isDir = context.isDir
            // refresh context
            context = context.children
            notFount = false
            break
          }
        }
        if (notFount) return '' // TODO: goto 404
      }
      // disable the last nav
      this.navs[this.navs.length - 1].disabled = true
      return result
    }
  },
  created() {
    this.rawPath = this.getRawPath()
  }
}
</script>
