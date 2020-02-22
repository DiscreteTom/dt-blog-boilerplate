<template>
  <v-list dense v-if="$store.state.current.toc">
    <v-subheader>TOC</v-subheader>
    <div class="toc-content">
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
    </div>
  </v-list>
</template>

<style lang="less" scoped>
.toc-content {
  max-height: 500px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: #ccc;
  }
}
</style>
