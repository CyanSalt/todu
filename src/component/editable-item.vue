<template>
  <li @click="toggle">
    <span class="drag-anchor" :draggable="editable" @dragstart="drag"></span>
    <checkbox :checked="item.done"></checkbox>
    <input type="text" class="editor" v-model.trim.lazy="description"
      @click.stop @keyup.enter="blur" v-if="editable">
    <span class="description" v-else>{{ description }}</span>
    <span class="from" v-if="!instant && item.from" :title="editable && format(item.from, true)">
      {{ editable ? distance(item.from, true) : format(item.from, true) }}
    </span>
    <div class="facility">
      <span :class="['operation', 'timer', {'autohide': !timer}]"
        @click.stop="timing" v-if="editable && schedule && time">
        <span class="time">{{ time }}</span>
      </span>
      <span class="operation remove autohide" @click.stop="remove" v-if="editable">
        <span class="icon-trash"></span>
      </span>
    </div>
    <template v-if="note">
      <inputarea :text.sync="note" @click.native.stop ref="note" v-if="editable"></inputarea>
      <div class="history-note" v-else>{{ note }}</div>
    </template>
  </li>
</template>

<script>
import CheckBox from './checkbox'
import InputArea from './inputarea'
import Formatter from './date-formatter'

export default {
  components: {
    'checkbox': CheckBox,
    'inputarea': InputArea,
  },
  mixins: [Formatter],
  props: {
    item: Object,
    instant: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    recoverable: {
      type: Boolean,
      default: false,
    },
    schedule: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    today() {
      return this.standard(Date.now())
    },
    time() {
      const matches = this.item.description.match(/\d{1,2}:\d{2}/)
      if (!matches || new Date(`${this.today} ${matches[0]}`) <= Date.now()) {
        return ''
      }
      return matches[0]
    },
    description: {
      get() {
        return this.item.description
      },
      set(value) {
        if (!value) return
        this.$emit('describe', value)
      }
    },
    note: {
      get() {
        return this.item.note
      },
      set(value) {
        if (!value) {
          this.tear().then(() => {
            this.$emit('comment', value)
          })
        } else {
          this.$emit('comment', value)
        }
      }
    }
  },
  data() {
    return {
      timer: false,
      removed: false,
      torn: false,
    }
  },
  methods: {
    toggle() {
      if (!this.recoverable) {
        this.$emit('toggle')
        return
      }
      this.collapse().then(() => {
        this.$emit('toggle')
      })
    },
    collapse() {
      if (this.removed) {
        return new Promise(() => {})
      }
      this.removed = true
      const collapse = [
        {height: `${this.$el.clientHeight}px`},
        {height: 0},
      ]
      return new Promise(resolve => {
        const animation = this.$el.animate(collapse, {
          easing: 'ease',
          duration: 300,
        })
        animation.onfinish = resolve
      })
    },
    tear() {
      if (!this.note || this.torn) {
        return new Promise(() => {})
      }
      this.torn = true
      const {note} = this.$refs
      const collapse = [
        // 8px = 0.5em
        // Use this expression because border-box cannot collapse completely
        {height: `${note.$el.clientHeight - 8}px`},
        {height: 0},
      ]
      return new Promise(resolve => {
        const animation = note.$el.animate(collapse, {
          easing: 'ease',
          duration: 300,
        })
        animation.onfinish = resolve
      }).then(() => {
        this.torn = false
      })
    },
    remove() {
      this.collapse().then(() => {
        this.$emit('remove')
      })
    },
    drag(e) {
      if (!this.editable) return
      // fix blink's bug
      const ratio = window.devicePixelRatio ** 2
      const {offsetX, offsetY} = e
      e.dataTransfer.setDragImage(this.$el, offsetX * ratio, offsetY * ratio)
      this.$emit('drag', e)
    },
    blur(e) {
      e.target.blur()
      if (e.shiftKey && !this.note) {
        this.note = this.description
      }
    },
    timing() {
      if (this.timer) {
        this.interrupt(true)
        return
      }
      if (!this.time) return
      const time = new Date(`${this.today} ${this.time}`) - 3e5
      const binding = this.$binding.of('timer')
      binding.set(this.item, this.timer = this.$schedule.register(time, () => {
        binding.set(this.item, this.timer = false)
        this.$notifier.send({
          title: this.item.description,
          body: this.i18n('今天 %T#!33').replace('%T', this.time),
        })
      }))
    },
    interrupt(hard) {
      if (!this.timer) return
      this.$schedule.unregister(this.timer)
      this.timer = false
      // if soft, there will be a record remained in binding map
      if (hard) {
        this.$binding.of('timer').set(this.item, false)
      }
    },
    refresh() {
      if (!this.timer) return
      this.interrupt()
      this.timing()
    },
  },
  created() {
    if (this.schedule) {
      this.timer = this.$binding.of('timer').get(this.item)
      this.refresh()
      this.$watch('time', time => {
        this.refresh()
      })
    }
  },
  destroyed() {
    if (this.schedule) {
      this.interrupt()
    }
  }
}
</script>

<style>
.list .description {
  width: 0;
  flex-grow: 1;
  display: inline-block;
  vertical-align: middle;
  user-select: text;
}
.list .from {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
  font-size: 14px;
  color: #aaa;
}
.drag-anchor {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  height: 100%;
  width: 1.5em;
}
.list .operation.timer {
  width: 48px;
  font-size: 14px;
  color: #aaa;
}
.list .operation.timer:not(.autohide) {
  color: #2196f3;
}
@keyframes expand-note {
  from { height: 0; }
  to { height: 28px; }
}
.list li .input-area,
.list li .history-note {
  width: 100%;
  padding-left: 28px;
  padding-bottom: 0.5em;
  line-height: 1.75em;
  animation: expand-note 0.3s ease;
}
.list li .input-area::before,
.list li .history-note::before {
  content: '';
  position: absolute;
  top: 0;
  left: 9px;
  bottom: 0.5em;
  width: 2px;
  background: hsl(166, 60%, 60%);
}
.list li .history-note {
  position: relative;
  white-space: pre-wrap;
  word-break: break-all;
  user-select: text;
}
.list li .input-area .content {
  width: calc(100% - 28px);
  height: calc(100% - 0.5em);
}
</style>
