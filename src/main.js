import Vue from 'vue'
import I18N from './plugins/i18n'
import Action from './plugins/action'
import Binding from './plugins/binding'
import Schedule from './plugins/schedule'
import Notifier from './plugins/notifier'
import Variables from './plugins/variables'
import FileStorage from './plugins/storage'
import TitleBar from './components/titlebar'
import Switcher from './components/switcher'
import TodoView from './components/todo-view'
import GameView from './components/game-view'
import SuperButton from './components/super-button'

if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false
  Vue.config.productionTip = false
}

Vue.use(I18N)
Vue.use(Action)
Vue.use(Binding)
Vue.use(Schedule)
Vue.use(Notifier)
Vue.use(Variables)
Vue.use(FileStorage)

new Vue({
  el: '#main',
  components: {
    'titlebar': TitleBar,
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
    selecting: false,
    icon: '',
    handler() {
      this.selecting = !this.selecting
    },
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
})
