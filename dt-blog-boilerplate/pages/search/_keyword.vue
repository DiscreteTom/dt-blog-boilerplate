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
    <DirentCard
      v-for="path in $store.state.searchItems[$route.params.keyword]"
      :key="path"
      :dirent="$store.state.pathMap[path]"
    ></DirentCard>
  </div>
</template>

<script>
import DirentCard from '~/components/DirentCard.vue'

export default {
  validate({ params, store }) {
    return (
      params.keyword.length > 0 &&
      params.keyword[0] in store.state.searchItems &&
      params.keyword in store.state.searchItems[params.keyword]
    )
  },
  components: { DirentCard }
}
</script>
