<template>
  <v-list dense v-if="$store.state.current.toc">
    <v-subheader>TOC</v-subheader>
    <v-list-item
      v-for="(t, i) in $store.state.current.children"
      :key="i"
      @click="$vuetify.goTo('#' + t.slug)"
    >
      <v-list-item-content>
        <v-list-item-title>
          <span v-for="x in t.lvl - 1" :key="x"> - </span>
          {{ t.content }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
