let store = null

const Flux = {
  on(event, handler) {
    return store.$on(event, handler)
  },
  emit(event, payload) {
    return store.$emit(event, payload)
  },
  get(key) {
    return store[key]
  },
  set(key, value) {
    store[key] = value
  },
  dispatch(method, payload) {
    return store[method](payload)
  },
}

export function state(name) {
  return {
    get() {
      return Flux.get(name)
    },
    set(value) {
      return Flux.set(name, value)
    }
  }
}

export default {
  install(Vue, options) {
    store = new Vue(options)
    Vue.prototype.$flux = Flux
  }
}
