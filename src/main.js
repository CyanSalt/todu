import Vue from 'vue'
import Flux from './plugins/flux'
import I18N from './plugins/i18n'
import Binding from './plugins/binding'
import Schedule from './plugins/schedule'
import Notifier from './plugins/notifier'
import Variables from './plugins/variables'
import FileStorage from './plugins/storage'
import Root from './components/root'
import Store from './components/store'

Vue.use(I18N)
Vue.use(Binding)
Vue.use(Schedule)
Vue.use(Notifier)
Vue.use(Variables)
Vue.use(FileStorage)
Vue.use(Flux, Store)

new Vue(Root)
