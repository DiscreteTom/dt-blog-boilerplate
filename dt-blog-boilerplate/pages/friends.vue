<template>
  <div>
    <h1 class="ml-5">Friends</h1>
    <v-divider class="my-3"></v-divider>
    <div class="d-flex flex-wrap">
      <v-card
        v-for="friend in $store.state.config.friends"
        :key="friend.title"
        :href="friend.url"
        hover
        class="mx-3 my-3 flex-grow-1"
      >
        <v-card-title>{{ friend.title }}</v-card-title>
        <v-card-subtitle>{{ friend.description }}</v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script></script>
