const store = {}
const Variables = {
  get(key) {
    return store[key]
  },
  set(key, value) {
    store[key] = value
  },
  pop(key) {
    const value = store[key]
    store[key] = null
    return value
  }
}

export default {
  install(Vue, options) {
    Vue.prototype.$vars = Variables
  }
}
