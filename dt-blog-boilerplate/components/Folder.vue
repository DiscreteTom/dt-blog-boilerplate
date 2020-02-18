<template>
  <div>
    <v-hover
      v-slot:default="{ hover }"
      v-for="(dirent, i) in $store.state.current.children"
      :key="i"
    >
      <v-card tile :to="dirent.path" :color="hover ? '#f5f5f5' : undefined">
        <v-img
          :src="imgSrcs[i]"
        >
        </v-img>
        <v-card-title>
          <v-icon class="mr-5">{{ dirent.icon }}</v-icon>
          {{ dirent.title }}
          <v-icon v-if="dirent.isDir">mdi-chevron-right</v-icon>
        </v-card-title>
        <v-card-subtitle>
          {{ dirent.description }}
        </v-card-subtitle>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrcs: []
    }
  },
  methods: {
    refresh() {
      this.imgSrcs = []
      this.$store.state.current.children.map((dirent, i) => {
        if (dirent.img) {
          import(
            `~/../content/${dirent.rawPath
              .split('/')
              .slice(1, -1)
              .join('/')}/_img/${dirent.img}`
          ).then(data => {
            this.$set(this.imgSrcs, i, data.default)
          })
        }
      })
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
