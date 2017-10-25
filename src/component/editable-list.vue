<template>
  <div :class="['list-group', {'editable': editable}]">
    <div class="title">
      <span class="category">{{ title }}</span>
      <slot name="extra-title"></slot>
    </div>
    <ul class="list" @dragover.prevent>
      <template v-for="(item, index) in data">
        <editable-item :item="item" :editable="editable" :key="item.key"
          @toggle="toggle(item, index)" @remove="remove(item)"
          @describe="content => describe(item, index, content)"
          @drop.native="drop(item)" @drag="drag(item)"
          :schedule="schedule" :origin="origin">
        </editable-item>
        <div class="divider"></div>
      </template>
      <li class="add-item" v-if="editable" @drop="drop(null)">
        <input type="text" class="editor" :placeholder="i18n('添加待办事项#!11')"
          v-model.trim.lazy="input" @keyup.enter="add">
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
    origin: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: true,
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
  computed: {
    data: {
      get() {
        return this.list
      },
      set() {
        this.$emit('sync')
      }
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
    describe(item, index, content) {
      if (!this.editable) return
      item.description = content
      this.$set(this.data, index, item)
    },
    remove(item) {
      // recalculate index to avoid async animation issue
      const index = this.data.indexOf(item)
      if (index >= 0) {
        this.data.splice(index, 1)
      }
    },
    add() {
      if (!this.input) return
      this.data.push({
        key: this.uniqid(),
        description: this.input,
        done: false
      })
      this.clear()
    },
    clear() {
      this.input = ''
    },
    drag(item) {
      this.$buffer.set('dragging', {item, list: this.data})
    },
    drop(item) {
      const dragging = this.$buffer.get('dragging')
      this.$buffer.set('dragging', null)
      if (!dragging || item === dragging.item) return
      // recalculate index
      let srcIndex = dragging.list.indexOf(dragging.item)
      if (srcIndex >= 0) {
        dragging.list.splice(srcIndex, 1)
      }
      let toIndex = this.data.indexOf(item)
      if (toIndex >= 0) {
        // intuitive feature
        if (this.data === dragging.list && srcIndex <= toIndex) {
          toIndex++
        }
        this.data.splice(toIndex, 0, dragging.item)
      } else {
        this.data.push(dragging.item)
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
  margin-bottom: 1em;
  line-height: 49px;
  color: #666;
  border-bottom: 1px solid #f1f1f1;
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
  box-shadow: 0 0 6px 2px #f1f1f1;
}
@keyframes expand {
  from { height: 0; }
  to { height: 52px; }
}
.list li {
  padding: 0 2em;
  line-height: 3em;
  transition: background ease 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  animation: expand 0.3s ease;
}
.list li .facility {
  width: 110px;
  display: flex;
  justify-content: flex-end;
}
.editable .list li {
  cursor: pointer;
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
  font-size: 18px;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 4px;
  /* transition except visibility */
  transition: all ease 0.3s, visibility;
}
.list .operation:hover {
  background: #fff;
  box-shadow: 0 0 2px 1px #eee inset;
}
.list .remove {
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
