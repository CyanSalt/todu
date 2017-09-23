<template>
  <div :class="{'switcher': true, 'shown': show}">
    <span :class="[sheetClass('todo'), 'default']" @click="toggle(todo)"></span>
    <template v-if="sheets.length">
      <span class="sheet-divider"></span>
      <span :class="sheetClass(sheet.source)" @click="toggle(sheet)"
        v-for="sheet in sheets"></span>
    </template>
    <span class="sheet-divider"></span>
    <span class="sheet add" @click="add">
      <span class="fa fa-plus-square-o"></span>
    </span>
    <span :class="['sheet', 'remove', {'hidden': this.selected === 'todo'}]" @click="remove">
      <span class="fa fa-trash-o"></span>
    </span>
  </div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selected: String,
  },
  data() {
    return {
      sheets: this.$storage.loadSync('sheets') || [],
    }
  },
  computed: {
    todo() {
      return {
        source: 'todo',
      }
    }
  },
  methods: {
    sheetClass(source) {
      return {
        sheet: true,
        selected: this.selected === source,
      }
    },
    toggle(sheet) {
      if (this.selected === sheet.source) return
      this.$emit('toggle', sheet)
    },
    sync() {
      this.$storage.save('sheets', this.sheets)
    },
    add() {
      const sources = this.sheets.map(sheet => sheet.source)
        .reduce((collection, source) => {
          collection[source] = true
          return collection
        }, {})
      let source
      for (let index = 1; ; index++) {
        source = `todo-${index}`
        if (!sources[source]) break;
      }
      const last = {source}
      this.sheets.push(last)
      this.sync()
      this.toggle(last)
    },
    remove() {
      const {sheets, selected} = this
      let index = -1
      for (let i = 0, len = sheets.length; i < len; ++i) {
        if (sheets[i].source === selected) {
          index = i
          break
        }
      }
      this.toggle(this.todo)
      this.$storage.delete(selected)
      this.sheets.splice(index, 1)
      this.sync()
      // todo-view cache
      this.$action.emit('clean-source-cache', selected)
    }
  },
  created() {
    this.$action.on('change-title', target => {
      for (let sheet of this.sheets) {
        if (sheet.source === target.source) {
          sheet.title = target.title
          this.toggle(target)
          this.sync()
          break
        }
      }
    })
  }
}

</script>

<style>
.switcher {
  position: fixed;
  right: 0;
  bottom: 18px;
  height: 54px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  transform: translateX(100%) scale(0, 0);
  transition: transform ease 0.3s;
}
.switcher.shown {
  transform: translateX(-90px) scale(1, 1);
}
.sheet {
  display: inline-block;
  margin: 0 6px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: 18px;
  text-align: center;
  border-radius: 50%;
  transition: all ease 0.2s;
}
.sheet:not(.selected) {
  cursor: pointer;
}
.sheet-divider {
  margin: 0 6px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #bababa;
}
.sheet.selected, .sheet:hover {
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 24px;
}
.sheet:nth-child(5n) {
  background: hsl(3, 100%, 70%);
}
.sheet:nth-child(5n+1) {
  background: hsl(150, 65%, 50%);
}
.sheet:nth-child(5n+2) {
  background: hsl(48, 100%, 60%);
}
.sheet:nth-child(5n+3) {
  background: hsl(211, 100%, 60%);
}
.sheet:nth-child(5n+4) {
  background: hsl(289, 65%, 70%);
}
.sheet.default {
  background: hsl(166, 60%, 40%);
}
.sheet.add, .sheet.remove {
  background: transparent;
}
.sheet.add {
  color: #2196f3;
  background: transparent;
}
.sheet.remove {
  color: #ed5e63;
  background: transparent;
}
.sheet.hidden {
  width: 0;
  height: 0;
  line-height: 0;
  font-size: 0;
}
</style>
