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

      <v-spacer></v-spacer>

      <!-- Home Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="$router.push('/')">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
      <!-- Github Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :href="github">
            <v-icon>mdi-github-circle</v-icon>
          </v-btn>
        </template>
        <span>View on Github</span>
      </v-tooltip>
      <!-- Email Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :href="'mailto:' + email">
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </template>
        <span>Contact me</span>
      </v-tooltip>
      <!-- Share Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :data-clipboard-text="url" id="shareBtn">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </template>
        <span>Copy link</span>
      </v-tooltip>
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
import ClipboardJS from 'clipboard'

export default {
  data() {
    return {
      clipboard: null,
      drawer: false,
      isMounted: false,
      folders: process.env.contentFolders,
      title: process.env.config.title,
      root: process.env.config.root,
      github: process.env.config.github,
      email: process.env.config.email
    }
  },
  filters: {
    capitalizeFirst(s) {
      return s.charAt(0).toUpperCase() + s.substring(1)
    }
  },
  computed: {
    url() {
      return this.isMounted ? window.location.href : ''
    }
  },
  mounted() {
    this.isMounted = true
    this.clipboard = new ClipboardJS('#shareBtn')
  },
  beforeDestroy() {
    this.clipboard.destroy()
  }
}
</script>
