<template>
  <div>
    <DirentCard
      v-for="(dirent, i) in $store.state.current.children"
      :key="i"
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
