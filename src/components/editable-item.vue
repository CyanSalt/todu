<template>
  <li class="item">
    <span class="drag-anchor" :draggable="editable" @dragstart="drag"></span>
    <item-icon :pattern="item.icon" v-if="item.icon && editable"></item-icon>
    <checkbox :checked="item.done" @click.native="toggle"></checkbox>
    <input type="text" class="editor" v-model.trim.lazy="description"
      @keyup.enter="blur" v-if="editable">
    <span class="description" v-else>{{ description }}</span>
    <template v-if="editable">
      <span class="handler autohide" @click="simplify" v-if="note">
          <span class="icon-chevron-up"></span>
      </span>
      <span class="handler autohide" @click="complicate" v-else>
          <span class="icon-more"></span>
      </span>
    </template>
    <template v-if="editable">
      <span class="handler autohide" @click="emote">
          <span class="icon-hash"></span>
      </span>
    </template>
    <span class="from" v-if="!instant && item.from">
      {{ editable ? localinterval(item.from) : localdate(item.from) }}
    </span>
    <div class="facility">
      <span :class="['operation', 'timer', {'autohide': !timer && !expired, 'expired': expired}]"
        @click="timing" v-if="editable && schedule && time">
        <span class="icon-clock"></span>
      </span>
      <span class="operation remove autohide" @click="remove" v-if="editable">
        <span class="icon-trash"></span>
      </span>
    </div>
    <div class="note-line" v-if="note">
      <input-area v-model="note" ref="note" @mounted="noted"
        v-if="editable"></input-area>
      <div class="history-note" v-else>{{ note }}</div>
      <div class="links">
        <hyperlink :href="link" :key="index"
          v-for="(link, index) in links"></hyperlink>
      </div>
    </div>
  </li>
</template>

<script>
import CheckBox from './checkbox'
import InputArea from './input-area'
import HyperLink from './hyperlink'
import Formatter from './date-formatter'
import ItemIcon from './item-icon'

export default {
  components: {
    'checkbox': CheckBox,
    'input-area': InputArea,
    'hyperlink': HyperLink,
    'item-icon': ItemIcon,
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
      return this.digitdate(Date.now())
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
        this.$emit('modify', 'description', value)
      }
    },
    note: {
      get() {
        return this.item.note
      },
      set(value) {
        if (!value) {
          this.simplify()
        } else {
          this.$emit('modify', 'note', value)
        }
      }
    },
    links() {
      const regex = new RegExp('https?://[\\w-]+(?:\\.[\\w-]+)*' +
        '(?:[\\w.,@?^=%&;:/~+#-]*[\\w@?^=%&;/~+#-])?', 'g')
      return this.note.match(regex) || []
    }
  },
  data() {
    return {
      ready: false,
      timer: false,
      expired: false,
      removed: false,
      torn: false,
    }
  },
  methods: {
    toggle() {
      if (!this.recoverable) {
        if (this.editable) {
          this.$emit('modify', 'done', !this.item.done)
        }
        return
      }
      this.collapse().then(() => {
        this.$emit('modify', 'done', !this.item.done)
      })
    },
    collapse() {
      if (this.removed) {
        return new Promise(() => {})
      }
      this.removed = true
      return this.shrink(this.$el)
    },
    tear() {
      if (!this.note || this.torn) {
        return new Promise(() => {})
      }
      this.torn = true
      const {note} = this.$refs
      return this.shrink(note.$el).then(() => {
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
      if (e.shiftKey) {
        this.complicate()
      }
    },
    timing() {
      if (this.expired) {
        this.expired = false
        return
      }
      if (this.timer) {
        this.interrupt(true)
        return
      }
      if (!this.time) return
      const time = new Date(`${this.today} ${this.time}`) - 3e5
      const binding = this.$binding.of('timer')
      this.timer = this.$schedule.register(time, () => {
        this.timer = false
        this.expired = true
        binding.set(this.item, this.timer)
        this.$notifier.send({
          title: this.item.description,
          body: this.i18n('%T today#!33').replace('%T', this.time),
        })
      })
      if (!this.timer) {
        this.expired = true
      }
      binding.set(this.item, this.timer)
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
      this.expired = false
      if (!this.timer) return
      this.interrupt()
      this.timing()
    },
    noted(note) {
      if (!this.ready) return
      this.expand(note.$el)
    },
    shrink(element) {
      const style = getComputedStyle(element)
      if (style.getPropertyValue('--animation').trim() === 'none') {
        return Promise.resolve()
      }
      return new Promise(resolve => {
        const collapse = [
          {height: `${element.clientHeight}px`},
          {height: 0},
        ]
        const animation = element.animate(collapse, {
          easing: 'ease',
          duration: 300,
        })
        animation.onfinish = resolve
      })
    },
    expand(element) {
      const style = getComputedStyle(element)
      if (style.getPropertyValue('--animation').trim() === 'none') {
        return Promise.resolve()
      }
      return new Promise(resolve => {
        const expand = [
          {height: 0},
          {height: `${element.clientHeight}px`},
        ]
        const animation = element.animate(expand, {
          easing: 'ease',
          duration: 300,
        })
        animation.onfinish = resolve
      })
    },
    complicate() {
      if (this.note) return
      this.note = this.description
      this.$nextTick(() => {
        if (this.$refs.note) {
          this.$refs.note.focus()
        }
      })
    },
    simplify() {
      this.tear().then(() => {
        this.$emit('modify', 'note', undefined)
      })
    },
    emote() {
      const icons = [undefined, 'bookmark', 'cascade']
      const index = icons.indexOf(this.item.icon) + 1
      const revision = index < icons.length ? index : 0
      this.$emit('modify', 'icon', icons[revision])
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
  mounted() {
    // The same as private property 'this._isMounted'
    this.ready = true
    const adding = this.$vars.pop('adding')
    const style = getComputedStyle(this.$el)
    if (adding !== this.item.key) {
      if (style.getPropertyValue('--animation').trim() !== 'always') {
        return
      }
    }
    this.expand(this.$el)
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
  color: #aaa;
}
.list .operation.timer:not(.autohide) {
  color: #2196f3;
}
.list .operation.timer.expired {
  color: #ed5e63;
}
.list li .note-line {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.list li .input-area,
.list li .history-note {
  margin-left: 28px;
  border-bottom: 0.5em solid transparent;
  line-height: 1.75em;
  flex: 1;
}
.list li .input-area::before,
.list li .history-note::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -19px;
  width: 2px;
  background: var(--theme-color, #28a386);
  opacity: 0.5;
  transition: background-color ease 0.2s;
}
.list li .history-note {
  position: relative;
  white-space: pre-wrap;
  word-break: break-all;
  user-select: text;
}
.list li .links {
  max-width: 64px;
  line-height: 1.75em;
}
.list li .handler {
  display: inline-block;
  font-size: 16px;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: #aaa;
  /* transition except visibility */
  transition: all ease 0.3s, visibility;
}
.list li .handler:hover {
  color: #65737e;
}
</style>
