<template>
  <div>
    <component :is="selectedArticle" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      attributes: {},
      selectedArticle: null
    }
  },
  props: {
    rawPath: String
  },
  created() {
    if (this.rawPath) {
      const markdown = require(`~/../content/${this.rawPath}`)
      this.attributes = markdown.attributes
      this.selectedArticle = markdown.vue.component
    }
  }
}
</script>
