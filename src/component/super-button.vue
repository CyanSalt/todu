<template>
  <div class="super-button">
    <span :class="iconClass"></span>
  </div>
</template>

<script>

export default {
  props: {
    icon: {
      type: String,
      default: 'infinity'
    },
    standup: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconClass() {
      switch (this.icon) {
        case 'back':
          return 'icon-arrow-left'
        default:
          return {
            'icon-infinite': true,
            'standup': this.standup,
          }
      }
    }
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
  color: hsl(166, 60%, 60%);
  cursor: pointer;
  transition: all ease 0.3s;
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
.super-button .icon-infinite.standup {
  transform: rotate(90deg) translateY(1px);
}
</style>
