<template>
  <div class="updater">
    <span class="link" @click="download" v-if="prepared">{{ text }}</span>
  </div>
</template>

<script>
import {remote, shell, ipcRenderer} from 'electron'
import {rename, unlink, accessSync} from 'original-fs'
import {promisify} from 'util'

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
          return this.i18n('Downloading %R#!30')
            .replace('%R', `${this.downloaded}%`)
        case 2:
          return this.i18n('Pausing %R#!31')
            .replace('%R', `${this.downloaded}%`)
        case 3:
          return this.i18n('Relaunch and upgrade#!32')
        default:
          return this.i18n('Upgrade to %V#!29').replace('%V', this.version)
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
    compare(ver1, ver2) {
      const arr1 = ver1.split('.')
      const arr2 = ver2.split('.')
      while (true) {
        if (arr1.length === 0) {
          return arr2.length === 0 ? 0 : -1
        }
        if (arr2.length === 0) {
          return 1
        }
        const cur1 = parseInt(arr1.shift(), 10)
        const cur2 = parseInt(arr2.shift(), 10)
        if (cur1 !== cur2) {
          return cur1 < cur2 ? -1 : 1
        }
      }
    },
    download() {
      if (this.status === 0) {
        this.status = 1
        remote.getCurrentWebContents().downloadURL(this.link)
      } else if (this.status === 3) {
        this.install()
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
    start() {
      const item = this.item
      const totalBytes = item.getTotalBytes()
      const frame = remote.getCurrentWindow()
      item.once('done', (e, state) => {
        if (state === 'completed') {
          const temporary = this.path
          this.path = this.path.replace(/\.download$/, '')
          rename(temporary, this.path, () => {})
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
    },
    async install() {
      const asar = 'resources/app.asar'
      const backup = 'resources/app-backup.asar'
      const update = 'resources/update.asar'
      const unlinkAsync = promisify(unlink)
      const renameAsync = promisify(rename)
      try {
        await unlinkAsync(backup)
      } catch (e) {}
      try {
        await renameAsync(asar, backup)
      } catch (e) {
        console.error(e)
        shell.showItemInFolder(update)
        return
      }
      try {
        await renameAsync(update, asar)
      } catch (e) {
        console.error(e)
        shell.showItemInFolder(update)
        await renameAsync(backup, asar)
        return
      }
      remote.app.relaunch()
      remote.app.quit()
    },
    getDownloadItem(path) {
      return remote.getGlobal('downloads').get(path)
    },
  },
  created() {
    ipcRenderer.on('will-download', (e, path) => {
      this.path = path
      this.item = this.getDownloadItem(path)
      this.start()
    })
    // Remove unfinished update (probably downloading failed)
    unlink('resources/update.asar.download', () => {})
    try {
      accessSync('resources/update.asar')
      this.status = 3
      this.prepared = true
      return
    } catch (e) {}
    // Check update
    this.check()
      .catch(error => {})
      .then(data => {
        if (!data) return
        if (this.compare(data.name, remote.app.getVersion()) !== 1) return
        const assets = data.assets.find(file => {
          // return file.name.search(process.platform) !== -1
          return file.name.toLowerCase() === 'update.asar'
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
  color: #2196f3;
  cursor: pointer;
}
</style>
