<template>
  <v-breadcrumbs :items="$store.state.navs" large>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>
