<template>
  <div class="titlebar">
    <div class="title-name">
      <span class="icon-infinite"></span>
      <span class="title-text">{{title}}</span>
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
import {remote} from 'electron'

export default {
  props: {
    title: String,
  },
  data() {
    return {
      maximized: this.frame().isMaximized()
    }
  },
  methods: {
    frame() {
      return remote.getCurrentWindow()
    },
    minimize() {
      const frame = this.frame()
      frame.minimize()
    },
    maximize() {
      const frame = this.frame()
      if (frame.isMaximized()) {
        frame.unmaximize()
        this.maximized = false
      } else {
        frame.maximize()
        this.maximized = true
      }
    },
    close() {
      const frame = this.frame()
      frame.close()
    }
  }
}
</script>

<style>
html, body, #main {
  height: 100%;
}
.todo-view {
  height: calc(100% - 28px);
  overflow-y: auto;
}
.titlebar {
  display: flex;
  justify-content: space-between;
  height: 28px;
  line-height: 28px;
  -webkit-app-region: drag;
  user-select: none;
  background: rgba(255, 255, 255, 0.5);
}
.titlebar .title-name {
  font-size: 12px;
  padding-left: 10px;
}
.titlebar .icon-infinite {
  vertical-align: top;
  margin-right: 2px;
  color: hsl(166, 60%, 40%);
}
.titlebar .buttons {
  display: flex;
}
.titlebar .button {
  width: 48px;
  text-align: center;
  -webkit-app-region: no-drag;
  cursor: default;
}
.titlebar .button:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
