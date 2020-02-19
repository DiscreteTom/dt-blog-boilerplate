<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(paths, tagName) in $store.state.tagMap"
        :key="tagName"
      >
        <v-expansion-panel-header>{{ tagName }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <DirentCard
            v-for="path in paths"
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
  }
}
</script>
