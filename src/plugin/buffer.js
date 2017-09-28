const store = {}
const Buffer = {
  get(key) {
    return store[key]
  },
  set(key, value) {
    store[key] = value
  }
}

export default {
  install: function(Vue, options) {
    Vue.prototype.$buffer = Buffer
  }
}
