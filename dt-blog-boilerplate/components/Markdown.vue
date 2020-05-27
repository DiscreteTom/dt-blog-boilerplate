<template>
  <div>
    <v-row>
      <!-- Content -->
      <v-col>
        <!-- header -->
        <div class="ml-5">
          <h1>
            {{ $store.state.current.title }}
          </h1>
          <p class="text--secondary">{{ $store.state.current.description }}</p>
          <img v-if="imgSrc" :src="imgSrc" style="max-width:100%" />
        </div>
        <div class="content mx-5 markdown-body">
          <component :is="selectedArticle" />
        </div>
      </v-col>
      <!-- right TOC, hide when small  -->
      <v-col cols="3" class="hidden-sm-and-down">
        <TOC header restrict style="position:fixed"></TOC>
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
      selectedArticle: null,
      imgSrc: ''
    }
  },
  methods: {
    refresh() {
      if (!this.$store.state.current.isDir) {
        // load markdown
        // rawPath: '/xxx/yyy'
        import(
          `~/../content/${this.$store.state.current.rawPath.slice(1)}`
        ).then(m => {
          this.attributes = m.attributes
          this.selectedArticle = m.vue.component
          // progress bar state
          this.$nuxt.$loading.finish()
          // re-render mathjax content
          // ref: https://stackoverflow.com/a/52638172/12407789
          // ref: https://juejin.im/post/5bb60837e51d450e805b7d97
          this.$nextTick().then(() => {
            window.MathJax.Hub.Queue([
              'Typeset',
              window.MathJax.Hub,
              document.getElementsByClassName('markdown-body')
            ])
          })
        })
        // load title img
        this.imgSrc = ''
        if (this.$store.state.current.img) {
          import(
            `~/../content/${this.$store.state.current.rawPath
              .split('/')
              .slice(1, -1)
              .join('/')}/_img/${this.$store.state.current.img}`
          ).then(data => {
            this.imgSrc = data.default
          })
        }
      }
    }
  },
  watch: {
    '$store.state.current.rawPath': 'refresh'
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
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
  code {
    color: #000;
    font-size: 85%;
    box-shadow: none;
    font-weight: normal;
    &:after,
    &:before {
      content: none;
      letter-spacing: none;
    }
  }
}
</style>
