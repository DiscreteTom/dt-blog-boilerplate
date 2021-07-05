<template>
  <div>
    <!-- header -->
    <div class="ml-5 mb-5">
      <h1>
        <v-icon>mdi-magnify</v-icon>
        {{ $route.params.keyword }}
        <v-icon>mdi-chevron-right</v-icon>
      </h1>
    </div>

    <div v-if="paths.length">
      <DirentCard
        v-for="path in paths"
        :key="path"
        :dirent="$store.state.pathMap[path]"
      ></DirentCard>
    </div>
    <div v-else>
      <p>
        No result
      </p>
      <v-btn to="/" plain block>
        go to home page
      </v-btn>
    </div>
  </div>
</template>

<script>
import DirentCard from '~/components/DirentCard.vue'

export default {
  components: { DirentCard },
  data() {
    return {
      paths: []
    }
  },
  methods: {
    loadPaths() {
      this.paths = []

      let keyword = this.$route.params.keyword
      if (
        keyword.length &&
        keyword[0] in this.$store.state.searchItems &&
        keyword in this.$store.state.searchItems[keyword[0]]
      )
        this.paths = this.$store.state.searchItems[keyword[0]][keyword]
    }
  },
  mounted() {
    let keyword = this.$route.params.keyword

    if (keyword.length) {
      if (!(keyword[0] in this.$store.state.searchItems)) {
        fetch(`/searchable-static/${keyword[0]}.json`)
          .then(res => res.json())
          .then(res => {
            this.$store.commit('addSearchItems', {
              start: keyword[0],
              items: res
            })
            this.loadPaths()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      } else {
        this.loadPaths()
      }
    }
  }
}
</script>

<style scoped>
p {
  text-align: center;
  font-size: 50px;
  margin-top: 30vh;
  font-weight: bolder;
  color: gray;
}
v-btn {
  border-bottom: solid 1px;
  margin: auto;
}
</style>
