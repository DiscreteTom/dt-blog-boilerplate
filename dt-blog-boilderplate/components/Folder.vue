<template>
  <div>
    <v-btn
      block
      x-large
      class="justify-start"
      :to="$route.params.pathMatch + '/' + dirent.name"
      v-for="(dirent, i) in context"
      :key="i"
    >
      <v-icon class="mr-5">{{ dirent.icon }}</v-icon>
      {{ dirent.name }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    context: Array
  }
}
</script>
