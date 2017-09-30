<template>
  <div class="updater">
    <span class="link" @click="download" v-if="prepared">{{ text }}</span>
  </div>
</template>

<script>
import {shell} from 'electron'

export default {
  props: {
    owner: {
      type: String,
      default: 'CyanSalt',
    },
    repo: {
      type: String,
      default: 'todu',
    },
  },
  data() {
    return {
      prepared: false,
      version: '',
      link: '',
    }
  },
  computed: {
    checkpoint() {
      return `https://api.github.com/repos/${this.owner}/${this.repo}/releases/latest`
    },
    text() {
      return this.i18n('更新 %V#!29').replace('%V', this.version)
    },
  },
  methods: {
    check() {
      return fetch(this.checkpoint)
        .then(response => {
          if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
          }
          return response.json()
        })
    },
    download() {
      shell.openExternal(this.link)
    }
  },
  created() {
    const platform = process.platform
    this.check()
      .catch(error => {})
	    .then(data => {
        if (data.name <= VERSION) return
        const assets = data.assets.find(assets => {
          return assets.name.search(platform) !== -1
        })
        if (!assets) return
        this.version = data.name
        this.link = assets.browser_download_url
        this.prepared = true
      })
  }
}

</script>

<style>
.updater .link {
  color: #03a9f4;
  cursor: pointer;
}
</style>
