const store = {}
const Schedule = {
  register(time, handler) {
    time = new Date(time)
    const timeout = time - Date.now()
    if (timeout < 1) {
      return false
    }
    const id = setTimeout(handler, timeout)
    store[id] = {time, handler}
    return id
  },
  unregister(id) {
    clearTimeout(id)
    const data = store[id]
    delete store[id]
    return data
  },
}

export default {
  install(Vue, options) {
    Vue.prototype.$schedule = Schedule
  }
}
