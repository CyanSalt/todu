const store = {}
const Binding = {
  of(key) {
    if (!store[key]) {
      store[key] = new Map()
    }
    return store[key]
  }
}

export default {
  install: function(Vue, options) {
    Vue.prototype.$binding = Binding
  }
}
