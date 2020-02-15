<template>
  <v-breadcrumbs
    v-if="$store.state.navs.length && $route.name == 'all'"
    :items="[{ text: '', href: '/' }].concat($store.state.navs)"
    large
  >
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>
