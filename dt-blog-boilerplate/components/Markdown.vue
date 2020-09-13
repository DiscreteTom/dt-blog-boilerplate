<template>
  <div>
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
    <v-row v-if="$store.state.current.siblings">
      <!-- previous post -->
      <v-col v-if="previous">
        <v-card
          outlined
          hover
          style="height:100%"
          :to="previous ? previous.path : ''"
        >
          <v-card-text class="overline">PREVIOUS</v-card-text>
          <v-card-title>{{ previous ? previous.title : '' }}</v-card-title>
        </v-card>
      </v-col>
      <!-- next post -->
      <v-col v-if="next">
        <v-card outlined hover style="height: 100%" :to="next ? next.path : ''">
          <v-card-text class="overline">NEXT</v-card-text>
          <v-card-title>{{ next ? next.title : '' }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attributes: {},
      selectedArticle: null,
      imgSrc: '',
      previous: null, // dirent
      next: null // dirent
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
          // get next & previous post link
          if (this.$store.state.current.siblings) {
            // get parent
            let parentPath = this.$store.state.current.parentPath
            let parent = this.$store.state.pathMap[parentPath]
            if (parentPath == '/') parent = this.$store.state.root
            if (parent != null) {
              // get current index
              let currentIndex = 0
              for (
                currentIndex = 0;
                currentIndex < parent.children.length;
                currentIndex++
              ) {
                if (
                  parent.children[currentIndex].path ==
                  this.$store.state.current.path
                )
                  break
              }
              // get previous & next post
              if (currentIndex > 0)
                this.previous = parent.children[currentIndex - 1]
              else this.previous = null
              if (currentIndex < parent.children.length - 1)
                this.next = parent.children[currentIndex + 1]
              else this.next = null
            }
          }
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
