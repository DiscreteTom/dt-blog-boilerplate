<template>
  <div>
    <!-- header -->
    <div class="ml-5">
      <h1>
        {{ $store.state.current.title }}
        <v-icon>mdi-chevron-right</v-icon>
      </h1>
      <p class="text--secondary">{{ $store.state.current.description }}</p>
    </div>
    <DirentCard
      v-for="dirent in $store.state.current.children"
      :key="dirent.path"
      :dirent="dirent"
    >
    </DirentCard>
  </div>
</template>

<script>
import DirentCard from './DirentCard'

export default {
  components: { DirentCard }
}
</script>
