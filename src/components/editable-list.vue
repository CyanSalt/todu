<template>
  <div :class="['list-group', {'editable': editable}]">
    <div class="title">
      <span class="category">{{ title }}</span>
      <slot name="extra-title"></slot>
    </div>
    <ul class="list" @dragover.prevent>
      <template v-for="(item, index) in list">
        <editable-item :item="item" :editable="editable" :key="item.key"
          @toggle="toggle(item, index)" @remove="remove(item)"
          @describe="content => describe(item, index, content)"
          @comment="content => comment(item, index, content)"
          @drop.native="drop(item)" @drag="drag(item)" :schedule="schedule"
          :instant="instant" :recoverable="recoverable">
        </editable-item>
        <div class="divider"></div>
      </template>
      <li class="add-item" v-if="editable" @drop="drop(null)">
        <input type="text" class="editor" :placeholder="i18n('Add a to-do#!11')"
          v-model.trim.lazy="input" @keyup.enter="add" ref="creator">
        <div class="facility">
          <span class="operation remove autohide" @click.stop="clear" v-if="input">
            <span class="icon-trash"></span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import EditableItem from './editable-item'

export default {
  components: {
    'editable-item': EditableItem,
  },
  props: {
    title: String,
    list: Array,
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
  data() {
    return {
      input: ''
    }
  },
  methods: {
    uniqid() {
      const random = Math.floor(Math.random() * 0xFFFFFF).toString(16)
      return `000000${random}`.slice(-6)
    },
    toggle(item, index) {
      if (!this.editable && !this.recoverable) return
      item.done = !item.done
      this.$set(this.list, index, item)
      this.$emit('update:list', this.list)
    },
    describe(item, index, content) {
      if (!this.editable) return
      item.description = content
      this.$set(this.list, index, item)
      this.$emit('update:list', this.list)
    },
    comment(item, index, content) {
      if (!this.editable) return
      this.$set(item, 'note', content)
      this.$set(this.list, index, item)
      this.$emit('update:list', this.list)
    },
    remove(item) {
      // recalculate index to avoid async animation issue
      const index = this.list.indexOf(item)
      if (index >= 0) {
        this.list.splice(index, 1)
        this.$emit('update:list', this.list)
      }
    },
    add() {
      if (!this.input) return
      const key = this.uniqid()
      const item = {
        key,
        description: this.input,
        done: false
      }
      this.$vars.set('adding', key)
      this.list.push(item)
      this.$emit('update:list', this.list)
      this.clear()
    },
    clear() {
      this.input = ''
      // Fix conflict with v-model.lazy
      this.$refs.creator.value = ''
    },
    drag(item) {
      this.$vars.set('dragging', {item, list: this.list})
    },
    drop(item) {
      const dragging = this.$vars.pop('dragging')
      if (!dragging || item === dragging.item) return
      // recalculate index
      const srcIndex = dragging.list.indexOf(dragging.item)
      if (srcIndex >= 0) {
        dragging.list.splice(srcIndex, 1)
      }
      let toIndex = this.list.indexOf(item)
      if (toIndex >= 0) {
        // intuitive feature
        if (this.list === dragging.list && srcIndex <= toIndex) {
          toIndex += 1
        }
        this.list.splice(toIndex, 0, dragging.item)
      } else {
        this.list.push(dragging.item)
      }
      this.$emit('update:list', this.list)
    }
  },
}
</script>

<style>
.list-group {
  margin-bottom: 1em;
}
.title {
  padding: 0 1em;
  margin-bottom: 1em;
  line-height: 49px;
  color: #65737e;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.category {
  font-size: 28px;
}
.divider {
  margin: 0 1em;
  border-top: 1px solid #f1f1f1;
}
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.05);
}
.list li {
  padding: 0 2em;
  line-height: 3em;
  transition: background ease 0.2s;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow: hidden;
}
.list li .facility {
  width: 110px;
  display: flex;
  justify-content: flex-end;
}
.editable .list li:hover {
  background: #f7f7f7;
}
.list .autohide {
  visibility: hidden;
}
.list li:hover .autohide {
  visibility: visible;
}
.list .operation {
  display: inline-block;
  margin-left: 8px;
  font-size: 16px;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  /* transition except visibility */
  transition: all ease 0.3s, visibility;
}
.list .operation:hover {
  background: #fff;
  box-shadow: 0 0 2px 1px #eee inset;
}
.list .remove {
  font-size: 18px;
  color: #ed5e63;
}
.date {
  float: right;
}
.editable .date {
  cursor: pointer;
}
input.editor {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  flex-grow: 1;
  -webkit-appearance: none;
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background: transparent;
  outline: none;
}
</style>
