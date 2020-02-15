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
  methods: {
    refresh() {
      if (this.$store.state.rawPath) {
        // rawPath: '/xxx/yyy'
        import(`~/../content/${this.$store.state.rawPath.slice(1)}`).then(m => {
          this.attributes = m.attributes
          this.selectedArticle = m.vue.component
        })
      }
    }
  },
  watch: {
    '$store.state.rawPath': 'refresh'
  },
  created() {
    this.refresh()
  }
}
</script>
