<template>
  <div :class="['switcher', {'shown': show}]">
    <span :class="[sheetClass(todo), 'default']" @click="toggle(todo)"></span>
    <template v-if="extras.length">
      <span class="sheet-divider"></span>
      <span :class="[sheetClass(sheet), colorClass(sheet)]"
        @click="toggle(sheet)" v-for="sheet in extras"></span>
    </template>
    <span class="sheet-divider"></span>
    <span class="sheet-ctrl add" @click="add">
      <span class="icon-plus"></span>
    </span>
    <span :class="['sheet-ctrl', 'remove', {'hidden': selected === 'todo'}]" @click="remove">
      <span class="icon-trash"></span>
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
      sheets: this.$storage.loadSync('sheets') || [this.model('todo')],
    }
  },
  computed: {
    todo() {
      return this.sheets.find(sheet => sheet.source === 'todo')
    },
    extras() {
      return this.sheets.filter(sheet => sheet.source !== 'todo')
    }
  },
  methods: {
    sheetClass(sheet) {
      return {
        sheet: true,
        selected: this.selected === sheet.source,
      }
    },
    colorClass(sheet) {
      const matches = sheet.source.match(/\d+/)
      const number = matches ? matches[0] : 0
      const colors = ['yellow', 'blue', 'purple', 'red', 'green']
      return colors[number % colors.length]
    },
    // another algorithm
    color(sheet) {
      let number = sheet.source.split('')
        .map((_, i) => sheet.source.charCodeAt(i))
        .reduce((a, b) => a + b, 0)
      number = (360 * 2 * Math.round((number + 5) % 13) / 13) % 360
      return `hsl(${number}, 80%, 60%)`
    },
    toggle(sheet) {
      if (this.selected === sheet.source) return
      this.$emit('toggle', sheet)
    },
    sync() {
      this.$storage.save('sheets', this.sheets)
    },
    model(source) {
      return {
        source,
        title: '',
        repeat: false,
        type: 'daily',
      }
    },
    add() {
      const sources = this.sheets.map(sheet => sheet.source)
        .reduce((collection, source) => {
          collection[source] = true
          return collection
        }, {})
      let source = ''
      for (let index = 1; ; index++) {
        source = `todo-${index}`
        if (!sources[source]) break
      }
      const last = this.model(source)
      this.sheets.push(last)
      this.sync()
      this.toggle(last)
    },
    remove() {
      const {sheets, selected} = this
      const index = sheets.findIndex(sheet => sheet.source === selected)
      this.toggle(this.todo)
      this.$storage.delete(selected)
      this.sheets.splice(index, 1)
      this.sync()
      // todo-view cache
      this.$action.emit('clean-source-cache', selected)
    },
  },
  created() {
    // compatible with version <= 1.7.0
    if (!this.todo) {
      this.sheets.unshift(this.model('todo'))
      this.sync()
    }
    // force update without `toggle` method
    this.$emit('toggle', this.todo)
    this.$action.on('update-sheet', target => {
      this.toggle(target)
      this.sync()
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
  padding: 0 9px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  border-radius: 27px;
  background: rgba(252, 252, 252, 0.5);
  transform: translateX(100%) scale(0, 0);
  transition: transform ease 0.3s;
}
.switcher.shown {
  transform: translateX(-81px) scale(1, 1);
}
.sheet, .sheet-ctrl {
  display: inline-block;
  margin: 0 6px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: 18px;
  text-align: center;
  border-radius: 50%;
  transition: all ease 0.2s;
  cursor: pointer;
}
.sheet.selected {
  cursor: default;
}
.sheet.selected,
.sheet:hover,
.sheet-ctrl:hover {
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 24px;
}
.sheet.red {
  background: hsl(3, 100%, 70%);
}
.sheet.green {
  background: hsl(150, 65%, 50%);
}
.sheet.yellow {
  background: hsl(48, 100%, 60%);
}
.sheet.blue {
  background: hsl(211, 100%, 60%);
}
.sheet.purple {
  background: hsl(289, 65%, 70%);
}
.sheet.default {
  background: hsl(166, 60%, 40%);
}
.sheet-ctrl.add {
  color: #2196f3;
}
.sheet-ctrl.add .icon-plus {
  vertical-align: -1px;
}
.sheet-ctrl.remove {
  color: #ed5e63;
}
.sheet.hidden,
.sheet-ctrl.hidden {
  width: 0;
  height: 0;
  font-size: 0;
  margin: 0;
}
.sheet-divider {
  margin: 0 6px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #bababa;
}
</style>
