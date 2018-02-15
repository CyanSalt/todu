<template>
  <div id="main">
    <title-bar :title="title"></title-bar>
    <todo-view :data="view" @enjoy="enjoy"></todo-view>
    <super-button></super-button>
    <switcher :selected="view.source" @toggle="toggle"></switcher>
    <game-view :entry="egg" v-if="egg"></game-view>
  </div>
</template>

<script>
import TitleBar from './title-bar'
import Switcher from './switcher'
import TodoView from './todo-view'
import GameView from './game-view'
import SuperButton from './super-button'

export default {
  el: '#main',
  components: {
    'title-bar': TitleBar,
    'todo-view': TodoView,
    'super-button': SuperButton,
    'switcher': Switcher,
    'game-view': GameView,
  },
  data: {
    title: document.title,
    view: {
      source: 'todo',
      title: '',
      repeat: false,
      type: 'daily',
    },
    egg: 0,
  },
  methods: {
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
