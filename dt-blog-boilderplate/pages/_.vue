<template>
  <component :is="selectedArticle" />
</template>

<script>
/**
 * This page will handle all routes.
 * Path info is stored in `this.$route.params.pathMatch`
 */
export default {
  data() {
    return {
      attributes: {},
      selectedArticle: null,
      content: process.env.content
    }
  },
  methods: {
    getRawPath() {
      let paths = this.$route.params.pathMatch.split('/')
      let context = this.content
      let result = ''
      for (let i = 0; i < paths.length; ++i) {
        let notFount = true
        for (let j = 0; j < context.length; ++j) {
          if (paths[i] == context[j].name) {
            result += context[j].rawName
            context = context.children
            notFount = false
            break
          }
        }
        if (notFount) return ''
      }
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
