<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="(folder, i) in folders"
          :key="i"
          :to="'/' + (folder.title == config.root ? '' : folder.title)"
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
      <v-toolbar-title v-text="config.title" />

      <v-spacer></v-spacer>

      <!-- Me Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar size="36">
              <img :src="avatar" />
            </v-avatar>
          </v-btn>
        </template>
        <span>{{ config.author }}</span>
      </v-tooltip>
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
          <v-btn icon v-on="on" :href="config.repo">
            <v-icon>mdi-github-circle</v-icon>
          </v-btn>
        </template>
        <span>View source code</span>
      </v-tooltip>
      <!-- Email Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :href="'mailto:' + config.email">
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </template>
        <span>Contact me</span>
      </v-tooltip>
      <!-- Share Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            :data-clipboard-text="url"
            id="shareBtn"
            @click="snackbar = true"
          >
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
    <!-- Share Tip -->
    <v-snackbar v-model="snackbar" :timeout="2000" right top>
      Copied to clipboard
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import ClipboardJS from 'clipboard'
import axios from 'axios'

export default {
  data() {
    return {
      clipboard: null,
      drawer: false,
      isMounted: false,
      snackbar: false,
      avatar: '',
      folders: process.env.contentFolders,
      config: process.env.config
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
    axios
      .get('https://api.github.com/users/' + this.config.author)
      .then(res => (this.avatar = res.data.avatar_url))
  },
  beforeDestroy() {
    this.clipboard.destroy()
  }
}
</script>
