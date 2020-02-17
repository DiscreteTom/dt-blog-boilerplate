<template>
  <div>
    <v-item-group>
      <v-container>
        <v-item v-for="(dirent, i) in $store.state.current.children" :key="i">
          <v-card hover :to="dirent.path">
            <v-card-title>
              <v-icon class="mr-5">{{ dirent.icon }}</v-icon>
              {{ dirent.title }}
              <v-icon v-if="dirent.isDir">mdi-chevron-right</v-icon>
            </v-card-title>
            <v-card-subtitle>
              {{ dirent.description }}
            </v-card-subtitle>
          </v-card>
        </v-item>
      </v-container>
    </v-item-group>
  </div>
</template>
