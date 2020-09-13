<template>
  <div>
    <!-- header -->
    <div class="ml-5 mb-5">
      <h1>
        Tags
        <v-icon>mdi-chevron-right</v-icon>
      </h1>
    </div>

    <!-- tags -->
    <v-expansion-panels accordion tile hover>
      <v-expansion-panel v-for="item in sortedTagMap" :key="item.tagName">
        <v-expansion-panel-header>
          <div>
            <v-icon class="mr-5">mdi-tag</v-icon>
            <span class="font-weight-bold">{{ item.tagName }}</span>
            <span class="text--secondary">({{ item.paths.length }})</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DirentCard
            v-for="path in item.paths"
            :key="path"
            :dirent="$store.state.pathMap[path]"
          ></DirentCard>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import DirentCard from '~/components/DirentCard.vue'

export default {
  components: { DirentCard },
  head() {
    return {
      title: 'Tags',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Tags for ${this.$store.state.current.title}`
        }
      ]
    }
  },
  computed: {
    sortedTagMap() {
      let result = [] // [{tagName: string, paths: []}]
      Object.keys(this.$store.state.tagMap).map(key => {
        result.push({ tagName: key, paths: this.$store.state.tagMap[key] })
      })
      result.sort((a, b) => {
        return a.tagName.toLowerCase() > b.tagName.toLowerCase() ? 1 : -1
      })
      return result
    }
  }
}
</script>
