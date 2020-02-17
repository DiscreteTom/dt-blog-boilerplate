<template>
  <div>
    <v-hover
      v-slot:default="{ hover }"
      v-for="(dirent, i) in $store.state.current.children"
      :key="i"
    >
      <v-card tile :to="dirent.path" :color="hover ? '#f5f5f5' : undefined">
        <v-card-title>
          <v-icon class="mr-5">{{ dirent.icon }}</v-icon>
          {{ dirent.title }}
          <v-icon v-if="dirent.isDir">mdi-chevron-right</v-icon>
        </v-card-title>
        <v-card-subtitle>
          {{ dirent.description }}
        </v-card-subtitle>
      </v-card>
    </v-hover>
  </div>
</template>
