<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="(folder, i) in folders"
          :key="i"
          :to="'/' + (folder.title == root ? '' : folder.title)"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ folder.title | capitalizeFirst }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app hide-on-scroll flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt style="height:5000px" />
      </v-container>
    </v-content>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      folders: process.env.contentFolders,
      drawer: false,
      title: process.env.config.title,
      root: process.env.config.root
    }
  },
  filters: {
    capitalizeFirst(s) {
      return s.charAt(0).toUpperCase() + s.substring(1)
    }
  }
}
</script>
