<template>
  <div>
    <v-btn
      block
      x-large
      class="justify-start"
      v-for="(dirent, i) in $store.state.context"
      :to="$route.params.pathMatch + '/' + dirent.name"
      :key="i"
    >
      <v-icon class="mr-5">{{ dirent.icon }}</v-icon>
      {{ dirent.title }}
    </v-btn>
  </div>
</template>
