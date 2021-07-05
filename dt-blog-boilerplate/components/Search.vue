<template>
  <div>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="loading"
      :search-input.sync="search"
      dense
      hide-details
      item-text="word"
      label="Search"
      solo
      hide-no-data
      flat
    ></v-autocomplete>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      loading: false,
      search: null,
      items: []
    }
  },
  methods: {
    updateItems() {
      if (!this.search) {
        this.items = []
        return
      }
      let result = []
      if (this.search[0] in this.$store.state.searchItems) {
        for (const [word, urls] of Object.entries(
          this.$store.state.searchItems[this.search[0]]
        )) {
          result.push({ word })
        }
      }
      this.items = result
    }
  },
  watch: {
    search(val) {
      this.updateItems()

      // Items have already been loaded
      if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      // Lazily load input items
      if (val && val.length > 0 && !(val[0] in this.$store.state.searchItems)) {
        this.isLoading = true
        fetch(`/searchable-static/${val[0]}.json`)
          .then(res => res.json())
          .then(res => {
            this.$store.commit('addSearchItems', { start: val[0], items: res })
            this.updateItems()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      }
    }
  }
}
</script>

<style></style>
