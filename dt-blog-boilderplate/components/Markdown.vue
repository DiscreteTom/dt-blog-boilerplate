<template>
  <div>
    <component :is="selectedArticle" />
  </div>
</template>

<script>
export default {
  computed: {
    attributes() {
      if (this.$store.state.isDir || !this.$store.state.rawPath) return {}
      else
        return require(`~/../content/${this.$store.state.rawPath}`).attributes
    },
    selectedArticle() {
      if (this.$store.state.isDir || !this.$store.state.rawPath) return null
      else
        return require(`~/../content/${this.$store.state.rawPath}`).vue
          .component
    }
  }
}
</script>
