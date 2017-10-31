import EventEmitter from 'events'

export default {
  install(Vue, options) {
    // Vue.prototype.$action = new Vue()
    Vue.prototype.$action = new EventEmitter()
  }
}
