<template>
  <div :class="['switcher', {'shown': shown}]">
    <span :class="[sheetClass(todo), 'default']" @click="toggle(todo)"></span>
    <template v-if="extras.length">
      <span class="sheet-divider"></span>
      <span :class="[sheetClass(sheet), color(sheet.source)]"
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
import {state} from '../plugins/flux'

export default {
  props: {
    selected: String,
  },
  data() {
    return {
      sheets: this.normalize(this.$storage.loadSync('sheets.json')),
    }
  },
  computed: {
    shown: state('super-button/selecting'),
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
    color(source) {
      const matches = source.match(/\d+/)
      if (!matches) return ''
      const colors = [
        'red', 'orange', 'yellow', 'green',
        'cyan', 'blue', 'purple', 'brown',
      ]
      return colors[matches[0] % colors.length]
    },
    toggle(sheet) {
      if (this.selected === sheet.source) return
      this.$emit('toggle', sheet)
    },
    sync() {
      this.$storage.save('sheets.json', this.sheets)
    },
    model(source) {
      return {
        source,
        title: '',
        type: 'daily',
        repeat: false,
        theme: '',
      }
    },
    normalize(sheets) {
      if (!sheets) {
        return [this.model('todo')]
      }
      sheets = sheets.map(sheet => {
        return Object.assign(this.model(sheet.source), sheet)
      })
      // compatible with <= 1.7.0
      if (!sheets.find(sheet => sheet.source === 'todo')) {
        sheets.unshift(this.model('todo'))
      }
      return sheets
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
      this.$storage.delete(`${selected}.json`)
      this.sheets.splice(index, 1)
      this.sync()
      // todo-view cache
      this.$flux.emit('todo/clean', selected)
    },
  },
  created() {
    // force update without `toggle` method
    this.$emit('toggle', this.todo)
    this.$flux.on('sheets/update', target => {
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
  transform: translateX(100%) scale(0, 0);
  transition: transform ease 0.3s;
}
.switcher.shown {
  transition: transform ease 0.3s, backdrop-filter 0s 0.3s;
  transform: translateX(-81px) scale(1, 1);
  backdrop-filter: blur(2px);
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
  background: #ec5f67;
}
.sheet.orange {
  background: #f99157;
}
.sheet.yellow {
  background: #fac863;
}
.sheet.green {
  background: #99c794;
}
.sheet.cyan {
  background: #5fb3b3;
}
.sheet.blue {
  background: #6699cc;
}
.sheet.purple {
  background: #c594c5;
}
.sheet.brown {
  background: #ab7967;
}
.sheet.default {
  background: #28a386;
}
.sheet-ctrl.add {
  color: #2196f3;
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
