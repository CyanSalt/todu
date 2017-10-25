<template>
  <div class="todo-view">
    <div class="sheet-title">
      <span class="title-text" v-if="reviewing">{{ title }}</span>
      <span class="reloader" v-else-if="data.source === 'todo'"
        v-combo:5="reload" :key="data.source">{{ title }}</span>
      <input class="title-editor" v-model.trim.lazy="title" @keyup.enter="blur" v-else>
      <div class="links">
        <updater v-show="!reviewing"></updater>
        <span class="prev" @click="reviewing--" v-if="reviewing > 1">
          {{ i18n('上一页#!27') }}
        </span>
        <span class="next" @click="reviewing++" v-if="reviewing && !last">
          {{ i18n('下一页#!28') }}
        </span>
      </div>
    </div>
    <template v-if="reviewing">
      <editable-list :title="distance(each.date)" :list="each.values"
        :editable="false" v-for="each in page" :key="each.date">
        <span class="date" slot="extra-title" v-once>{{ format(each.date) }}</span>
      </editable-list>
    </template>
    <template v-else>
      <editable-list class="today" :title="i18n('Today#!1')" :list="terms[today]"
        @sync="sync" :schedule="true" :origin="!permanent">
        <sheet-stick :data="data" @review="review" slot="extra-title"
          v-if="data.source !== 'todo'"></sheet-stick>
        <span class="date" slot="extra-title" @click="review" v-once>{{ format(today) }}</span>
      </editable-list>
      <editable-list class="tomorrow" :title="i18n('Tomorrow#!2')" :list="terms[tomorrow]"
        @sync="sync" v-if="!data.repeat && !permanent">
      </editable-list>
    </template>
  </div>
</template>

<script>
import EditableList from './editable-list'
import SheetStick from './sheet-stick'
import Updater from './updater'
import Formatter from './date-formatter'

export default {
  components: {
    'editable-list': EditableList,
    'sheet-stick': SheetStick,
    'updater': Updater,
  },
  directives: {
    combo: {
      bind(el, {arg, value}) {
        if (typeof value !== 'function') return
        arg = parseInt(arg, 10)
        el.addEventListener('click', e => {
          if (e.detail === arg) value(e)
        })
      }
    }
  },
  mixins: [Formatter],
  props: {
    data: Object,
  },
  data() {
    return {
      cache: {},
      pagesize: 5,
      reviewing: 0,
      terms: {
        history: {}
      }
    }
  },
  computed: {
    title: {
      get() {
        if (this.reviewing) {
          return this.i18n('已办事项#!26')
        }
        return this.data.title || this.i18n('待办事项#!25')
      },
      set(title) {
        if (!title) return
        this.data.title = title
        this.$action.emit('update-sheet', this.data)
      }
    },
    today() {
      return this.standard(Date.now())
    },
    tomorrow() {
      return this.standard(Date.now() + 864e5)
    },
    history() {
      return Object.entries(this.terms.history).reverse()
        .map(([date, values]) => ({date, values}))
    },
    page() {
      if (!this.reviewing) return []
      const start = (this.reviewing - 1) * this.pagesize
      return this.history.slice(start, start + this.pagesize)
    },
    last() {
      return !this.history[this.reviewing * this.pagesize]
    },
    permanent() {
      return this.data.type === 'permanently'
    }
  },
  methods: {
    load() {
      if (this.cache[this.data.source]) {
        return this.cache[this.data.source]
      }
      const {today, tomorrow} = this
      const terms = this.$storage.loadSync(this.data.source)
      const arranged = Object.assign({
        history: {},
        [today]: [],
        [tomorrow]: []
      }, terms)
      const midnight = new Date(today)
      if (this.data.repeat && !arranged[today].length) {
        let latest, nearest = Infinity
        for (const key of Object.keys(arranged)) {
          const distance = midnight - new Date(key)
          if (distance > 0 && distance < nearest) {
            [latest, nearest] = [key, distance]
          }
        }
        if (latest) {
          arranged[today] = arranged[latest]
            .map(each => Object.assign({}, each, {done: false}))
        }
      }
      Object.keys(arranged).forEach(date => {
        if (!(new Date(date) < midnight)) return
        arranged[date].forEach(item => {
          const archived = []
          if (this.data.repeat || item.done) {
            archived.push(item)
          } else {
            if (!item.from) {
              item.from = date
            }
            arranged[today].push(item)
          }
          if (archived.length) {
            arranged.history[date] = (arranged.history[date] || [])
              .concat(archived)
          }
        })
        delete arranged[date]
      })
      this.cache[this.data.source] = arranged
      return arranged
    },
    sync() {
      this.$storage.save(this.data.source, this.terms)
    },
    review() {
      this.reviewing = 1
      this.$emit('bind', {
        icon: 'back',
        handler: () => {
          this.reviewing = 0
        }
      })
    },
    blur(e) {
      e.target.blur()
    },
    reload() {
      window.location.reload()
    },
  },
  created() {
    this.$action.on('clean-source-cache', target => {
      delete this.cache[target]
    })
    this.$schedule.register(`${this.tomorrow} 00:00`, () => {
      this.reload()
    })
    this.terms = this.load()
    this.sync()
  },
  beforeUpdate() {
    this.terms = this.load()
    this.sync()
  }
}
</script>

<style>
.todo-view {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 1em 1em 2em 1em;
}
.sheet-title {
  margin: 0 1em;
  height: 3em;
  line-height: 3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: hsl(166, 60%, 40%);
}
span.title-text {
  cursor: default;
}
input.title-editor {
  display: inline-block;
  -webkit-appearance: none;
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background: transparent;
  outline: none;
}
.sheet-title .prev, .sheet-title .next {
  cursor: pointer;
}
</style>
