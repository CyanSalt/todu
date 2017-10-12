const Schedule = {
  register(time, handler) {
    time = new Date(time)
    const timeout = time - Date.now()
    if (timeout < 1) {
      return false
    }
    const id = setTimeout(handler, timeout)
    return id
  },
  unregister(id) {
    clearTimeout(id)
  },
}

export default {
  install: function(Vue, options) {
    Vue.prototype.$schedule = Schedule
  }
}
