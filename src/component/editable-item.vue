<template>
  <li @click="toggle">
    <div class="left">
      <span class="drag-anchor" :draggable="editable" @dragstart="drag"></span>
      <checkbox :checked="item.done"></checkbox>
      <input type="text" class="editor" v-model.trim.lazy="description"
        @click.stop @keyup.enter="blur" v-if="editable">
      <span class="description" v-else>{{ description }}</span>
      <span class="from" v-if="item.from">
        {{ editable ? distance(item.from) : format(item.from) }}
      </span>
    </div>
    <div class="right">
      <span class="operation remove" @click.stop="remove" v-if="editable">
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
    editable: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
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
      removed: false
    }
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    remove() {
      if (this.removed) return
      this.removed = true
      // @keyframes collapse
      const collapse = [
        // from { height: 52px; }
        {height: '52px'},
        // to { height: 0; }
        {height: 0},
      ]
      // animation: collapse 0.3s ease;
      const animation = this.$el.animate(collapse, {
        easing: 'ease',
        duration: 300,
      })
      // this.$el.addEventListener('animationend')
      animation.onfinish = () => {
        this.$emit('remove')
      }
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
    }
  }
}
</script>

<style>
.list .description {
  width: 550px;
  display: inline-block;
  vertical-align: middle;
  user-select: text;
}
.list .from {
  display: inline-block;
  vertical-align: middle;
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
</style>
