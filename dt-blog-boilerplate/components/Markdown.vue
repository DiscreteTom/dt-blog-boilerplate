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
          <img v-if="imgSrc" :src="imgSrc" />
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
