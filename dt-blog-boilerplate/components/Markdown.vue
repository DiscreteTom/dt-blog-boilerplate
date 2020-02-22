<template>
  <div>
    <!-- header -->
    <div class="ml-5">
      <h1>
        {{ $store.state.current.title }}
      </h1>
      <p class="text--secondary">{{ $store.state.current.description }}</p>
    </div>
    <v-row class="flex-row-reverse">
      <!-- TOC -->
      <v-col cols="3">
        <TOC></TOC>
      </v-col>
      <!-- Content -->
      <v-col>
        <div class="content mx-5">
          <component :is="selectedArticle" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TOC from './TOC'
export default {
  components: { TOC },
  data() {
    return {
      attributes: {},
      selectedArticle: null
    }
  },
  methods: {
    refresh() {
      if (!this.$store.state.current.isDir) {
        // rawPath: '/xxx/yyy'
        import(
          `~/../content/${this.$store.state.current.rawPath.slice(1)}`
        ).then(m => {
          this.attributes = m.attributes
          this.selectedArticle = m.vue.component
        })
      }
    }
  },
  watch: {
    '$store.state.current.rawPath': 'refresh'
  },
  created() {
    this.refresh()
  }
}
</script>

<style lang="less" scoped>
// ref: https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
// ref: https://github.com/less/less.js/issues/2623
@deep: ~'>>>';
.content @{deep} {
  // style of markdown content
  img {
    width: 100%;
  }
}
</style>
