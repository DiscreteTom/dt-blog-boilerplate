<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="(dirent, i) in $store.state.content"
          :key="i"
          :to="'/' + dirent.name"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ dirent.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ dirent.isDir ? dirent.name : dirent.name | removeExtension }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app hide-on-scroll flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="$store.state.config.title" />
      <BreadCrumbs class="d-none d-sm-flex"></BreadCrumbs>

      <v-spacer></v-spacer>

      <!-- Author Btn -->
      <v-tooltip bottom v-if="$store.state.config.author">
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            :href="'https://github.com/' + $store.state.config.author"
          >
            <v-avatar size="36">
              <img v-if="avatar" :src="avatar" />
              <v-progress-linear
                v-else
                color="black lighten-2"
                buffer-value="0"
                stream
              ></v-progress-linear>
            </v-avatar>
          </v-btn>
        </template>
        <span>{{ $store.state.config.author }}</span>
      </v-tooltip>
      <!-- Home Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="$router.push('/' + $store.state.config.root)"
          >
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
      <!-- Github Btn -->
      <v-tooltip bottom v-if="$store.state.config.repo">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :href="$store.state.config.repo">
            <v-icon>mdi-github-circle</v-icon>
          </v-btn>
        </template>
        <span>View source code</span>
      </v-tooltip>
      <!-- Email Btn -->
      <v-tooltip bottom v-if="$store.state.config.email">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :href="'mailto:' + $store.state.config.email">
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
        <nuxt />
      </v-container>
    </v-content>
    <!-- Share Tip -->
    <v-snackbar v-model="snackbar" :timeout="2000" right top>
      Copied to clipboard
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-footer app absolute inset>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import ClipboardJS from 'clipboard'
import BreadCrumbs from '~/components/BreadCrumbs.vue'

export default {
  components: { BreadCrumbs },
  data() {
    return {
      clipboard: null,
      drawer: false,
      isMounted: false,
      snackbar: false,
      avatar: ''
    }
  },
  computed: {
    url() {
      return this.isMounted ? window.location.href : ''
    }
  },
  filters: {
    removeExtension(s) {
      return s.split('.')[0]
    }
  },
  mounted() {
    this.isMounted = true
    this.clipboard = new ClipboardJS('#shareBtn')
    if (this.$store.state.config.author) {
      this.$axios
        .$get('https://api.github.com/users/' + this.$store.state.config.author)
        .then(data => (this.avatar = data.avatar_url))
    }
  },
  beforeDestroy() {
    this.clipboard.destroy()
  }
}
</script>
