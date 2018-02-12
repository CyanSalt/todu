<template>
  <div class="title-bar">
    <div class="title-name">
      <span class="icon-infinite"></span>
      <span class="title-text">{{ title }}</span>
    </div>
    <div class="buttons">
      <div class="button minimize" @click="minimize">
        <span class="icon-minimize"></span>
      </div>
      <div class="button maximize" @click="maximize">
        <span :class="maximized ? 'icon-unmaximize' : 'icon-maximize'"></span>
      </div>
      <div class="button close" @click="close">
        <span class="icon-close"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {remote, ipcRenderer} from 'electron'

export default {
  props: {
    title: String,
  },
  data() {
    const frame = remote.getCurrentWindow()
    return {
      frame,
      maximized: frame.isMaximized()
    }
  },
  methods: {
    minimize() {
      this.frame.minimize()
    },
    maximize() {
      if (this.frame.isMaximized()) {
        this.frame.unmaximize()
      } else {
        this.frame.maximize()
      }
    },
    close() {
      this.frame.close()
    }
  },
  created() {
    ipcRenderer.on('maximize', () => {
      this.maximized = true
    })
    ipcRenderer.on('unmaximize', () => {
      this.maximized = false
    })
  }
}
</script>

<style>
.todo-view {
  height: calc(100vh - 28px);
  overflow-y: auto;
}
.title-bar {
  display: flex;
  justify-content: space-between;
  height: 28px;
  line-height: 28px;
  -webkit-app-region: drag;
  user-select: none;
  background: #fff;
}
.title-bar .title-name {
  font-size: 12px;
  padding-left: 10px;
}
.title-bar .icon-infinite {
  vertical-align: top;
  margin-right: 2px;
  color: #28a386;
}
.title-bar .buttons {
  display: flex;
}
.title-bar .button {
  width: 48px;
  text-align: center;
  -webkit-app-region: no-drag;
  cursor: default;
}
.title-bar .button:hover {
  background: rgba(0, 0, 0, 0.05);
}
.title-bar .minimize:hover {
  color: #259b24;
}
.title-bar .maximize:hover {
  color: #2196f3;
}
.title-bar .close:hover {
  color: #ed5e63;
}
</style>
