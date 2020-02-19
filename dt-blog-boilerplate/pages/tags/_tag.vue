<template>
  <div>
    <!-- header -->
    <div class="ml-5 mb-5">
      <h1>
        <v-icon>mdi-tag</v-icon>
        {{ $route.params.tag }}
        <v-icon>mdi-chevron-right</v-icon>
      </h1>
    </div>
    <DirentCard
      v-for="path in $store.state.tagMap[$route.params.tag]"
      :key="path"
      :dirent="$store.state.pathMap[path]"
    ></DirentCard>
  </div>
</template>

<script>
import DirentCard from '~/components/DirentCard.vue'

export default {
  validate({ params, store }) {
    return store.state.tagMap[params.tag]
  },
  components: { DirentCard }
}
</script>
