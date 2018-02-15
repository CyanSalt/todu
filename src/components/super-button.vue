<template>
  <div class="super-button" @click="handler">
    <span :class="iconClass"></span>
  </div>
</template>

<script>
import {state} from '../plugins/flux'

export default {
  data() {
    return {
      icon: 'infinity',
      handler: () => {
        this.selecting = !this.selecting
      },
    }
  },
  computed: {
    selecting: state('super-button/selecting'),
    iconClass() {
      switch (this.icon) {
        case 'back':
          return 'icon-arrow-left'
        default:
          return {
            'icon-infinite': true,
            'selecting': this.selecting,
          }
      }
    }
  },
  methods: {
    bind(data) {
      if (!data.handler) return
      this.selecting = false
      let icon = null
      if (data.icon) {
        icon = this.icon
        this.icon = data.icon
      }
      const handler = this.handler
      this.handler = () => {
        data.handler()
        if (data.icon) {
          this.icon = icon
        }
        this.handler = handler
      }
    }
  },
  created() {
    this.$flux.on('super-button/bind', this.bind)
  }
}

</script>

<style>
.super-button {
  position: fixed;
  bottom: 0.5em;
  right: 0.5em;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  text-align: center;
  line-height: 54px;
  font-size: 36px;
  color: #5cd6ba;
  cursor: pointer;
  transition: all ease 0.3s;
  z-index: 1;
}
@keyframes open {
  from { font-size: 0; }
  to { font-size: 36px; }
}
@keyframes circle {
  from { transform: rotate(180deg); }
  to { transform: rotate(0deg); }
}
.super-button:hover {
  background: #fff;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.05);
}
.super-button span {
  display: inline-block;
  transition: transform ease 0.3s;
}
.super-button .icon-infinite {
  display: inline-block;
  vertical-align: -1px;
  animation: circle 0.2s ease;
}
.super-button .icon-arrow-left {
  display: inline-block;
  vertical-align: top;
  animation: open 0.3s ease;
}
.super-button .icon-infinite.selecting {
  transform: rotate(90deg) translateY(1px);
}
</style>
