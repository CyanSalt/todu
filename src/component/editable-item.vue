<template>
  <li @click="toggle">
    <div class="left">
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
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    remove() {
      this.$el.classList.add('collapse')
      this.$el.addEventListener('animationend', () => {
        this.$emit('remove')
      })
    },
    blur(e) {
      e.target.blur()
    }
  }
}
</script>

<style>
.date {
  float: right;
}
.editable .date {
  cursor: pointer;
}
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
</style>
