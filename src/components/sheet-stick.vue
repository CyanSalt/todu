<template>
  <span class="sheet-stick">
    <span :class="['repeat', {'active': data.repeat}]" @click="repeat">
      <span class="icon-cycle"></span>
    </span>
    <span :class="['permanent', {'active': permanently}]" @click="permanent">
      <span class="icon-infinite"></span>
    </span>
    <span :class="['theme-indicator', next]" @click="facelift">
      <span class="icon-color"></span>
    </span>
    <span class="tunnel" @click="enjoy">
      <span class="icon-void"></span>
    </span>
  </span>
</template>

<script>
import Formatter from './date-formatter'

export default {
  mixins: [Formatter],
  props: {
    data: Object,
  },
  computed: {
    today() {
      return this.localdate(Date.now())
    },
    permanently() {
      return this.data.type === 'permanently'
    },
    next() {
      const colors = ['', 'theme-curcuma', 'theme-navy']
      const index = colors.indexOf(this.data.theme) + 1
      const revision = index < colors.length ? index : 0
      return colors[revision]
    }
  },
  methods: {
    repeat() {
      this.data.repeat = !this.data.repeat
      if (this.data.repeat) {
        this.data.type = 'daily'
      }
      this.$flux.emit('sheets/update', this.data)
    },
    permanent() {
      if (this.data.type === 'permanently') {
        this.data.type = 'daily'
      } else {
        this.data.type = 'permanently'
        this.data.repeat = false
      }
      this.$flux.emit('sheets/update', this.data)
    },
    facelift() {
      this.data.theme = this.next
      this.$flux.emit('sheets/update', this.data)
    },
    enjoy() {
      this.$flux.set('game/flag', 1)
      this.$flux.emit('super-button/bind', {
        icon: 'back',
        handler: () => {
          this.$flux.set('game/flag', 2)
        }
      })
    }
  }
}
</script>

<style>
.sheet-stick > span {
  display: inline-block;
  margin-left: 0.5em;
  cursor: pointer;
  color: #aaa;
  transition: all ease 0.2s;
}
.sheet-stick > span.active {
  color: var(--theme-color, #28a386);
  transform: rotate(180deg);
}
.sheet-stick .icon-void {
  display: inline-block;
  width: 1em;
  height: 1em;
}
.sheet-stick .icon-color {
  display: inline-block;
  margin: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--target-color, #28a386);
  border-top-color: var(--theme-color, #28a386);
  border-left-color: var(--theme-color, #28a386);
  vertical-align: -1px;
  transition: border-color ease 0.2s;
}
</style>
