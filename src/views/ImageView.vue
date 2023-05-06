<template>
  <div v-if="image">
    <h1>{{ image.name }}:{{ image.tag }}</h1>
    <div class="panels">
      <div class="panel">
        <h2><span class="material-icons">devices</span> Architecture</h2>
        <p>{{ image.architecture }}</p>
      </div>
      <div class="panel">
        <h2><span class="material-icons">desktop_windows</span> OS</h2>
        <p>{{ image.os }}</p>
      </div>
      <div class="panel">
        <h2><span class="material-icons">date_range</span> Date</h2>
        <p>{{ image.pretty_create_date }}</p>
      </div>
      <div class="panel">
        <h2><span class="material-icons">layers</span> Layers</h2>
        <p>{{ image.layers.length }}</p>
      </div>
      <div class="panel">
        <h2><span class="material-icons">storage</span> Size</h2>
        <p>{{ image.size_mb }} MB</p>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <h2><span class="material-icons">fingerprint</span> Digest</h2>
        <p>{{ image.digest }}</p>
      </div>
      <div class="panel">
        <h2><span class="material-icons">label</span> Labels</h2>
        <ul>
          <li v-for="(value, key) in image.labels" :key="key">
            <b>{{ key }}</b> <span>{{ value }}</span>
          </li>
        </ul>
      </div>
      <div class="panel">
        <h2><span class="material-icons">terminal</span> Cmd</h2>
        <ul>
          <li v-for="(key) in image.cmd" :key="key">
            <span>{{ key }}</span>
          </li>
        </ul>
      </div>
      <div class="panel" v-if="image.envs">
        <h2><span class="material-icons">settings</span> Envs</h2>
        <ul>
          <li v-for="(key) in image.envs" :key="key">
            <span>{{ key }}</span>
          </li>
        </ul>
      </div>
      <div class="panel" v-if="image.ports">
        <h2><span class="material-icons">network_check</span> Ports</h2>
        <ul>
          <li v-for="(key) in image.ports" :key="key">
            <span>{{ key }}</span>
          </li>
        </ul>
      </div>
      <div class="panel" v-if="image.entrypoint">
        <h2><span class="material-icons">settings</span> Entrypoint</h2>
        <ul>
          <li v-for="(key) in image.entrypoint" :key="key">
            <span>{{ key }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <h2><span class="material-icons">history</span> History</h2>
        <ul class="boxed-list">
          <li v-for="(item) in image.history" :key="item" class="boxed-list-wrapper">
            <div class="boxed-list-item">
              <span class="material-icons">date_range</span>
              <b>{{ new Date(item.created).toLocaleString() }}</b>
            </div>
            <div class="boxed-list-item">
              <span class="material-icons">terminal</span>
              <span>{{ item.created_by }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <h2><span class="material-icons">terminal</span> Pull Command</h2>
        <pre><code>podman pull {{ pullCmd }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { RegistryManager, OciImage } from '@/core/registry'
  import AtlasConfig from '@/config'

  export default defineComponent({
    name: 'ImageView',

    data() {
      return {
        image: ref<OciImage>(),
        pullCmd: ref<string>(),
      }
    },
    async mounted() {
      const route = useRoute()
      const registry = new RegistryManager()
      this.image = await registry.get_image(
        route.params.image as string, 
        route.params.tag as string
      )
      this.pullCmd = `${AtlasConfig.registry}/${this.image.name}:${this.image.tag}`.replace("https://", "")
      document.title = `${this.image.name}:${this.image.tag} - ${AtlasConfig.title}`
    },
  })
</script>