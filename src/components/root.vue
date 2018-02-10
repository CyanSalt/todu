<template>
  <div id="main">
    <titlebar :title="title"></titlebar>
    <todo-view :data="view" @bind="bind" @enjoy="enjoy"></todo-view>
    <super-button @click.native="trigger" :icon="icon" :standup="selecting"></super-button>
    <switcher :show="selecting" :selected="view.source" @toggle="toggle"></switcher>
    <game-view :entry="egg" v-if="egg"></game-view>
  </div>
</template>

<script>
import TitleBar from './titlebar'
import Switcher from './switcher'
import TodoView from './todo-view'
import GameView from './game-view'
import SuperButton from './super-button'

export default {
  components: {
    'titlebar': TitleBar,
    'todo-view': TodoView,
    'super-button': SuperButton,
    'switcher': Switcher,
    'game-view': GameView,
  },
  data() {
    return {
      title: document.title,
      view: {
        source: 'todo',
        title: '',
        repeat: false,
        type: 'daily',
      },
      egg: 0,
      selecting: false,
      icon: '',
      handler() {
        this.selecting = !this.selecting
      },
    }
  },
  methods: {
    bind(data) {
      if (!data.handler) return
      this.selecting = false
      let icon = null
      if (data.icon) {
        icon = this.icon
        this.icon = data.icon
      }
      const handler = this.handler
      this.handler = () => {
        data.handler()
        if (data.icon) {
          this.icon = icon
        }
        this.handler = handler
      }
    },
    trigger() {
      this.handler()
    },
    toggle(sheet) {
      this.$set(this, 'view', sheet)
    },
    enjoy(flag) {
      this.egg = flag ? 1 : 2
    }
  },
  beforeCreate() {
    // custom stylesheet
    const stylesheet = this.$storage.rawdataSync('custom', 'css')
    if (stylesheet) {
      const element = document.createElement('style')
      element.appendChild(document.createTextNode(stylesheet))
      document.head.appendChild(element)
    }
  },
  created() {
    // custom script
    this.$storage.require('custom', init => init(this))
  }
}
</script>
