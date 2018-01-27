<template>
  <span class="sheet-stick">
    <span :class="['repeat', {'active': data.repeat}]" @click="repeat">
      <span class="icon-cycle"></span>
    </span>
    <span :class="['permanent', {'active': permanently}]" @click="permanent">
      <span class="icon-infinite"></span>
    </span>
    <span :class="['theme-dial', next]" @click="facelift">
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
      return this.format(Date.now())
    },
    permanently() {
      return this.data.type === 'permanently'
    },
    next() {
      const colors = ['', 'curcuma', 'navy']
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
      this.$action.emit('update-sheet', this.data)
    },
    permanent() {
      if (this.data.type === 'permanently') {
        this.data.type = 'daily'
      } else {
        this.data.type = 'permanently'
        this.data.repeat = false
      }
      this.$action.emit('update-sheet', this.data)
    },
    facelift() {
      this.data.theme = this.next
      this.$action.emit('update-sheet', this.data)
    },
    enjoy() {
      this.$emit('enjoy')
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
  border: 2px solid var(--theme-color, #28a386);
  vertical-align: -1px;
  transition: border-color ease 0.2s;
}
</style>
