<template>
  <div>
    <BreadCrumbs class="d-flex d-sm-none"></BreadCrumbs>
    <Folder v-show="$store.state.current.isDir"></Folder>
    <Markdown v-show="!$store.state.current.isDir"></Markdown>
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
  middleware:'content'
}
</script>
