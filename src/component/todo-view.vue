<template>
  <div class="todo-view">
    <div class="sheet-title">
      <input class="title-editor" v-model.trim.lazy="title"
        v-if="!reviewing && data.source !== 'todo'">
      <span class="title-text" v-else>{{ title }}</span>
    </div>
    <template v-if="reviewing">
      <editable-list :title="distance(each.date)" :data="each.values" :editable="false"
        v-for="each in history" :key="each.date">
        <span class="date" slot="category-info" v-once>{{ format(each.date) }}</span>
      </editable-list>
    </template>
    <template v-else>
      <editable-list class="today" :title="i18n('Today#!1')"
        :data="terms[today]" @sync="sync">
        <span class="date" slot="category-info" @click="review" v-once>{{ format(today) }}</span>
      </editable-list>
      <editable-list class="tomorrow" :title="i18n('Tomorrow#!2')"
        :data="terms[tomorrow]" @sync="sync">
      </editable-list>
    </template>
  </div>
</template>

<script>
import EditableList from './editable-list'
import Formatter from './date-formatter'

export default {
  components: {
    'editable-list': EditableList,
  },
  mixins: [Formatter],
  props: {
    data: Object,
  },
  data() {
    return {
      cache: {},
      reviewing: false,
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
        this.data.title = title
        this.$action.emit('change-title', this.data)
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
      Object.keys(arranged).forEach(date => {
        if (date >= today) return
        arranged[date].forEach(item => {
          const archived = []
          if (item.done) {
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
    standard(date) {
      // return new Date(date).toLocaleDateString()
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    sync() {
      this.$storage.save(this.data.source, this.terms)
    },
    review() {
      this.reviewing = true
      this.$emit('bind', {
        icon: 'back',
        handler: () => {
          this.reviewing = false
        }
      })
    }
  },
  created() {
    this.$action.on('clean-source-cache', target => {
      delete this.cache[target]
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
  margin: 1em auto 2em auto;
}
.sheet-title {
  margin-left: 1em;
  height: 3em;
  line-height: 3em;
  color: hsl(166, 60%, 40%);;
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
</style>
