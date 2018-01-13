<template>
  <span class="sheet-stick">
    <span :class="['repeat', {'active': data.repeat}]" @click="repeat">
      <span class="icon-cycle"></span>
    </span>
    <span :class="['permanent', {'active': permanently}]" @click="permanent">
      <span class="icon-infinite"></span>
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
    }
  },
  methods: {
    review() {
      this.$emit('review')
    },
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
  color: hsl(166, 60%, 40%);
  transform: rotate(180deg);
}
</style>
