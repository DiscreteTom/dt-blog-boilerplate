<template>
  <v-app>
    <p v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </p>
    <p v-else>
      {{ otherError }}
    </p>
    <v-btn to="/" plain>
      go to home page
    </v-btn>
  </v-app>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
p {
  text-align: center;
  font-size: 50px;
  margin-top: 30vh;
  font-weight: bolder;
  color: gray;
}
v-btn {
  border-bottom: solid 1px;
}
</style>
