import Vue from 'vue'
import I18N from './plugins/i18n'
import Action from './plugins/action'
import Binding from './plugins/binding'
import Schedule from './plugins/schedule'
import Notifier from './plugins/notifier'
import Variables from './plugins/variables'
import FileStorage from './plugins/storage'
import Root from './components/root'

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

new Vue(Root)
