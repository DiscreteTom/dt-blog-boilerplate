<template>
  <div>
    <v-btn
      block
      x-large
      class="justify-start"
      v-for="(dirent, i) in context"
      :to="($route.params.pathMatch || config.root) + '/' + dirent.name"
      :key="i"
    >
      <v-icon class="mr-5">{{ dirent.icon }}</v-icon>
      {{ dirent.name }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: process.env.config
    }
  },
  computed: {
    context() {
      return this.$store.state.context
    }
  }
}
</script>
