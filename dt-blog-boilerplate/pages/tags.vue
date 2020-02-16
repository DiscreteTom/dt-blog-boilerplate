<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(paths, tagName) in $store.state.tagMap"
        :key="tagName"
      >
        <v-expansion-panel-header>{{ tagName }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn
            block
            x-large
            class="justify-start"
            v-for="(path, i) in paths"
            :key="i"
            :to="path"
          >
            <v-icon class="mr-5">{{ $store.state.pathMap[path].icon }}</v-icon>
            {{ $store.state.pathMap[path].title }}
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Tags'
  }
}
</script>
