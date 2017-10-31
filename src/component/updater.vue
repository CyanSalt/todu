<template>
  <div class="updater">
    <span class="link" @click="download" v-if="prepared">{{ text }}</span>
  </div>
</template>

<script>
import {remote, shell} from 'electron'

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
      status: 0,
      downloaded: 0,
      path: '',
      item: null,
    }
  },
  computed: {
    checkpoint() {
      return `https://api.github.com/repos/${this.owner}/${this.repo}/releases/latest`
    },
    text() {
      switch (this.status) {
        case 1:
          return this.i18n('下载中 %R#!30').replace('%R', `${this.downloaded}%`)
        case 2:
          return this.i18n('暂停中 %R#!31').replace('%R', `${this.downloaded}%`)
        case 3:
          return this.i18n('下载完成#!32')
        default:
          return this.i18n('更新 %V#!29').replace('%V', this.version)
      }
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
      // shell.openExternal(this.link)
      if (this.status === 0) {
        this.status = 1
        remote.getCurrentWebContents().downloadURL(this.link)
      } else if (this.status === 3) {
        shell.showItemInFolder(this.path)
      } else if (!this.item) {
        // return
      } else if (this.item.isPaused()) {
        this.item.resume()
        this.status = 1
      } else {
        this.item.pause()
        this.status = 2
      }
    },
    start(item) {
      this.item = item
      const totalBytes = item.getTotalBytes()
      const frame = remote.getCurrentWindow()
      item.once('updated', (e, state) => {
        this.path = item.getSavePath()
      })
      item.once('done', (e, state) => {
        if (state === 'completed') {
          shell.showItemInFolder(this.path)
          this.status = 3
        } else {
          this.path = ''
          this.status = 0
        }
        this.item = null
        this.downloaded = 0
        frame.setProgressBar(-1)
      })
      item.on('updated', (e, state) => {
        const progress = item.getReceivedBytes() / totalBytes
        this.downloaded = Math.floor(progress * 100)
        frame.setProgressBar(progress)
      })
    }
  },
  created() {
    const webContents = remote.getCurrentWebContents()
    webContents.session.on('will-download', (e, item, contents) => {
      this.start(item)
    })
    const platform = process.platform
    this.check()
      .catch(error => {})
      .then(data => {
        if (!data || data.name <= remote.app.getVersion()) return
        const assets = data.assets.find(file => {
          return file.name.search(platform) !== -1
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
