<template>
  <li @click="toggle">
    <span class="drag-anchor" :draggable="editable" @dragstart="drag"></span>
    <checkbox :checked="item.done"></checkbox>
    <input type="text" class="editor" v-model.trim.lazy="description"
      @click.stop @keyup.enter="blur" v-if="editable">
    <span class="description" v-else>{{ description }}</span>
    <span class="from" v-if="!instant && item.from">
      {{ editable ? distance(item.from) : format(item.from) }}
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
  </li>
</template>

<script>
import CheckBox from './checkbox'
import Formatter from './date-formatter'

export default {
  components: {
    'checkbox': CheckBox,
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
    }
  },
  data() {
    return {
      timer: false,
      removed: false
    }
  },
  methods: {
    toggle() {
      if (!this.recoverable) {
        return this.$emit('toggle')
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
      // @keyframes collapse
      const collapse = [
        // from { height: 52px; }
        {height: '52px'},
        // to { height: 0; }
        {height: 0},
      ]
      return new Promise(resolve => {
        // animation: collapse 0.3s ease;
        const animation = this.$el.animate(collapse, {
          easing: 'ease',
          duration: 300,
        })
        // this.$el.addEventListener('animationend')
        animation.onfinish = resolve
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
      e.dataTransfer.setDragImage(this.$el, e.offsetX * ratio, e.offsetY * ratio)
      this.$emit('drag', e)
    },
    blur(e) {
      e.target.blur()
    },
    timing() {
      if (this.timer) {
        return this.interrupt(true)
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
</style>
