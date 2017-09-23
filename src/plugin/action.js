import EventEmitter from 'events'

export default {
  install: function(Vue, options) {
    // Vue.prototype.$action = new Vue()
    Vue.prototype.$action = new EventEmitter()
  }
}
