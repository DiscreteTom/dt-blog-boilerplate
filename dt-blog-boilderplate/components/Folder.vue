<template>
  <div>
    <v-btn
      block
      x-large
      class="justify-start"
      v-for="(dirent, i) in $store.state.context"
      :to="dirent.path"
      :key="i"
    >
      <v-icon class="mr-5">{{ dirent.icon }}</v-icon>
      {{ dirent.title }}
    </v-btn>
  </div>
</template>
