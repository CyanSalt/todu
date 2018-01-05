const store = {}
const Variables = {
  get(key) {
    return store[key]
  },
  set(key, value) {
    store[key] = value
  }
}

export default {
  install(Vue, options) {
    Vue.prototype.$vars = Variables
  }
}
