<template>
  <div>
    <BreadCrumbs class="d-md-none"></BreadCrumbs>
    <Folder v-if="$store.state.current.isDir"></Folder>
    <Markdown v-else></Markdown>
  </div>
</template>

<script>
/**
 * This page will handle all routes.
 * Path info is stored in `this.$route.path`
 */
import Markdown from '~/components/Markdown.vue'
import Folder from '~/components/Folder.vue'
import BreadCrumbs from '~/components/BreadCrumbs.vue'

export default {
  components: { Markdown, Folder, BreadCrumbs },
  head() {
    return {
      title: this.$store.state.current.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$store.state.current.description
        }
      ]
    }
  },
  validate({ route, store }) {
    // if path not in pathMap, throw 404
    return store.state.pathMap[route.path]
  }
}
</script>
