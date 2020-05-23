<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      tile
      :to="dirent.path"
      :style="{
        'background-image': `url(${imgSrc})`,
        'background-position': imgPosition,
        'background-size': imgSize
      }"
    >
      <!-- background image linear gradient mask -->
      <div
        :style="
          dirent.img && {
            'background-image': 'linear-gradient(to right, #fff, #ffffff33)',
            'background-position': imgPosition,
            'background-size': imgSize
          }
        "
      >
        <!-- hover shadow mask -->
        <div :style="hover && `background-color:${hoverColor}`">
          <v-card-title>
            <v-icon style="margin-right:1%">{{ dirent.icon }}</v-icon>
            {{ dirent.title }}
            <v-chip
              class="ml-2"
              small
              v-for="tag in dirent.tags"
              :key="tag"
              @click.stop.prevent="$router.push('/tags/' + tag)"
            >
              {{ tag }}
            </v-chip>
            <v-icon v-if="dirent.isDir">mdi-chevron-right</v-icon>
          </v-card-title>
          <v-card-subtitle>
            {{ dirent.description }}
          </v-card-subtitle>
        </div>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    dirent: Object
  },
  data() {
    return {
      hoverColor: '#0000000d',
      imgPosition: 'right',
      imgSize: 'cover',
      imgSrc: ''
    }
  },
  created() {
    this.imgSrc = ''
    if (this.dirent.img) {
      import(
        `~/../content/${this.dirent.rawPath
          .split('/')
          .slice(1, -1)
          .join('/')}/_img/${this.dirent.img}`
      ).then(data => {
        this.imgSrc = data.default
      })
    }
  }
}
</script>
