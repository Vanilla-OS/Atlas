<template>
  <table class="table">
    <tr>
      <th>Name</th>
      <th>Date</th>
      <th>Size</th>
      <th>Digest</th>
    </tr>
    <tr v-for="image in images" :key="image.name">
      <td><router-link :to="{ name: 'Image', params: { image: image.name, tag: image.tag } }">{{ image.name }}</router-link></td>
      <td>{{ image.pretty_create_date }}</td>
      <td>{{ image.size_mb }} MB</td>
      <td>{{ image.digest }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { RegistryManager, OciImage } from '@/core/registry'

  export default defineComponent({
    name: 'HomeView',

    data() {
      return {
        images: ref<OciImage[]>([]),
      }
    },

    async mounted() {
      const registry = new RegistryManager()
      this.images = await registry.get_images()
    },
  })
</script>