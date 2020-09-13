<template>
  <v-app>
    <!-- left drawer -->
    <v-navigation-drawer v-model="leftDrawer" clipped app>
      <!-- show site title when small -->
      <div class="hidden-md-and-up">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ $store.state.config.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>

      <v-list>
        <!-- TOC -->
        <div v-show="$store.state.hasToc" class="hidden-md-and-up mb-5">
          <v-list-item @click="toggleToc">
            <v-list-item-action>
              <v-icon>mdi-table-of-contents</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                TOC
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-expansion-panels accordion flat v-model="showToc">
            <v-expansion-panel>
              <v-expansion-panel-content>
                <TOC></TOC>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-divider></v-divider>
        </div>
        <!-- navs -->
        <v-list-item
          v-for="(dirent, i) in $store.state.root.children"
          :key="i"
          :to="'/' + dirent.name + '/'"
          router
        >
          <v-list-item-action>
            <v-icon>{{ dirent.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ dirent.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- friends -->
        <template
          v-if="
            $store.state.config.friends && $store.state.config.friends.length
          "
        >
          <v-divider class="my-3"></v-divider>
          <v-list-item to="/friends/" router>
            <v-list-item-action>
              <v-icon>{{ $store.state.config.friendsIcon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Friends
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- right drawer -->
    <v-navigation-drawer
      app
      clipped
      right
      disable-resize-watcher
      :value="drawerRight"
    >
      <TOC header></TOC>
    </v-navigation-drawer>

    <!-- top bar -->
    <v-app-bar clipped-left clipped-right fixed app flat>
      <!-- left drawer btn -->
      <v-app-bar-nav-icon @click.stop="leftDrawer = !leftDrawer" />
      <!-- site title -->
      <v-toolbar-title
        class="d-none d-sm-flex"
        v-text="$store.state.config.title"
      />

      <BreadCrumbs class="d-none d-md-flex"></BreadCrumbs>

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
      <!-- Tags Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="$router.push('/tags')">
            <v-icon>mdi-tag-multiple</v-icon>
          </v-btn>
        </template>
        <span>Tags</span>
      </v-tooltip>
      <!-- Github Btn -->
      <v-tooltip bottom v-if="$store.state.config.repo">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :href="$store.state.config.repo">
            <v-icon>mdi-github</v-icon>
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

    <!-- main content -->
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

    <!-- footer -->
    <v-footer app absolute inset>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import ClipboardJS from 'clipboard'
import BreadCrumbs from '~/components/BreadCrumbs.vue'
import TOC from '~/components/TOC.vue'

export default {
  components: { BreadCrumbs, TOC },
  data() {
    return {
      clipboard: null,
      leftDrawer: true,
      isMounted: false,
      snackbar: false,
      avatar: '',
      showToc: -1 // 0 means show toc. This is the index of v-expansion-panels.
    }
  },
  methods: {
    toggleToc() {
      if (this.showToc == -1) this.showToc = 0
      else this.showToc = -1
    }
  },
  computed: {
    url() {
      return this.isMounted ? window.location.href : ''
    },
    drawerRight() {
      return this.$vuetify.breakpoint.mdAndUp && this.$store.state.hasToc
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
