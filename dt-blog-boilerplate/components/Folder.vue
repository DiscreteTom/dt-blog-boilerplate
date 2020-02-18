<template>
  <div>
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
