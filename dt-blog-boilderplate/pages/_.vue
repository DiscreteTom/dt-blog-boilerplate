<template>
  <div>
    <v-breadcrumbs :items="navs" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <component :is="selectedArticle" />
  </div>
</template>

<script>
/**
 * This page will handle all routes.
 * Path info is stored in `this.$route.params.pathMatch`
 */
export default {
  data() {
    return {
      navs: [],
      attributes: {},
      selectedArticle: null,
      content: process.env.content
    }
  },
  methods: {
    // calculate `this.navs`, return rawPath
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
    let rawPath = this.getRawPath()
    const markdown = require(`~/../content/${rawPath}`)
    this.attributes = markdown.attributes
    this.selectedArticle = markdown.vue.component
  }
}
</script>
