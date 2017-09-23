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
        case 'back': return 'icon-back'
      }
      return {
        'icon-infinity': true,
        'standup': this.standup,
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
  line-height: 52px;
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
  box-shadow: 0 0 6px 2px #f1f1f1;
}
.super-button span {
  display: inline-block;
  transition: transform ease 0.3s;
}
.super-button .icon-infinity {
  animation: circle 0.2s ease;
}
.super-button .icon-back {
  animation: open 0.3s ease;
}
.super-button .icon-infinity::before {
  content: '\221E';
  font-family: "PingFang SC";
}
.super-button .icon-back::before {
  content: '\2190';
  font-family: "PingFang SC";
  display: block;
  width: 28px;
  overflow: hidden;
  margin: 2px auto;
}
.super-button .icon-infinity.standup {
  transform: rotate(90deg);
}
</style>
