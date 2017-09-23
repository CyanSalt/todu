<template>
  <div :class="{'list-group': true, 'editable': editable}">
    <div class="title">
      <span class="category">{{ title }}</span>
      <slot name="category-info"></slot>
    </div>
    <ul class="list">
      <template v-for="(item, index) in data">
        <li @click="toggle(item, index)" :key="item.key" ref="item">
          <div class="left">
            <checkbox :checked="item.done"></checkbox>
            <input type="text" class="editor" v-model.trim.lazy="item.description"
              @click.stop @keyup.enter="blur" @focus="recent = item" v-if="editable">
            <span class="description" v-else>{{ item.description }}</span>
            <span class="from" v-if="item.from">
              {{ editable ? distance(item.from) : format(item.from) }}
            </span>
          </div>
          <div class="right">
            <span class="operation remove" @click.stop="remove(item, index)" v-if="editable">
              <span class="fa fa-trash-o"></span>
            </span>
          </div>
        </li>
        <div class="divider"></div>
      </template>
      <li class="add-item" v-if="editable">
        <div class="left">
          <input type="text" class="editor" :placeholder="i18n('添加待办事项#!11')"
            v-model.trim.lazy="newItem" @keyup.enter="add">
          </div>
        <div class="right">
          <span class="operation remove" @click.stop="clear" v-if="newItem">
            <span class="fa fa-trash-o"></span>
          </span>
        </div>
      </li>
    </ul>
  </div>
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
    title: String,
    data: Array,
    editable: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      recent: {},
      newItem: ''
    }
  },
  methods: {
    uniqid() {
      return ('000000' + Math.floor(Math.random() * 0xFFFFFF).toString(16)).slice(-6)
    },
    toggle(item, index) {
      if (!this.editable) return
      item.done = !item.done
      this.$set(this.data, index, item)
    },
    remove(item, index) {
      // this.data.splice(index, 1)
      const el = this.$refs.item[index]
      el.classList.add('collapse')
      el.addEventListener('animationend', () => {
        // recalculate
        index = this.data.indexOf(item)
        if (index >= 0) {
          this.data.splice(index, 1)
        }
      })
    },
    add() {
      if (!this.newItem) return
      this.data.push({
        key: this.uniqid(),
        description: this.newItem,
        done: false
      })
      this.clear()
    },
    clear() {
      this.newItem = ''
    },
    blur(e) {
      e.target.blur()
    }
  },
  watch: {
    data() {
      this.$emit('sync')
    },
    'recent.description': function (value, oldValue) {
      if (oldValue && !value) {
        this.recent.description = oldValue
      }
    }
  }
}
</script>

<style>
.list-group {
  margin-bottom: 1em;
}
.title {
  padding: 0 1em;
  line-height: 49px;
  color: #666;
  border-bottom: 1px solid #f1f1f1;
}
.category {
  font-size: 28px;
}
.date {
  float: right;
}
.editable .date {
  cursor: pointer;
}
.divider {
  margin: 0 1em;
  border-top: 1px solid #f1f1f1;
}
.list {
  margin: 0;
  margin-top: 1em;
  padding: 0;
  list-style: none;
  background: #fff;
  box-shadow: 0 0 6px 2px #f1f1f1;
}
@keyframes expand {
  from { height: 0; }
  to { height: 52px; }
}
@keyframes collapse {
  from { height: 52px; }
  to { height: 0; }
}
.list li.collapse {
  animation: collapse 0.3s ease;
}
.list li {
  padding: 0 2em;
  line-height: 3em;
  transition: background ease 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  animation: expand 0.3s ease;
}
.editable .list li {
  cursor: pointer;
}
.editable .list li:hover {
  background: #f7f7f7;
}
.list .operation {
  display: none;
  font-size: 18px;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  line-height: 28px;
  text-align: center;
  border-radius: 4px;
  transition: all ease 0.3s;
}
.list li:hover .operation {
  display: inline-block;
}
.list .operation:hover {
  background: #fff;
  box-shadow: 0 0 2px 1px #eee inset;
}
.list .remove {
  color: #ed5e63;
}
input.editor {
  width: 550px;
  display: inline-block;
  vertical-align: middle;
  -webkit-appearance: none;
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background: transparent;
  outline: none;
}
span.description {
  width: 550px;
  display: inline-block;
  vertical-align: middle;
  user-select: text;
}
.add-item input.editor {
  width: 600px;
}
.list .from {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  color: #aaa;
}
</style>
