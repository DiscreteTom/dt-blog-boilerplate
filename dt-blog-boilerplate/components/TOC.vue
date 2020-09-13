<template>
  <v-list dense v-if="$store.state.hasToc">
    <v-subheader v-if="header">TOC</v-subheader>
    <div class="toc-content">
      <v-list-item
        v-for="(t, i) in $store.state.current.toc"
        :key="i"
        @click="$vuetify.goTo('#' + t.slug)"
      >
        <v-list-item-content>
          <v-list-item-title>
            <span v-for="x in t.lvl - 1" :key="x" class="ml-3"></span>
            <span :style="{ 'font-weight': 1000 / t.lvl }">
              {{ t.content }}
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
export default {
  props: { header: Boolean }
}
</script>
