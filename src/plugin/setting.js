import {FileStorage} from './storage'

const Setting = {
  data: {},
  load() {
    this.data = FileStorage.fetchSync('setting', {})
    return this
  },
  get(key) {
    return this.data[key]
  },
  set(key, value) {
    const old = this.get(key)
    if (old !== this.data[key]) {
      this.data[key] = value
      FileStorage.save('setting', this.data)
    }
  }
}

export default {
  install: function(Vue, options) {
    Vue.prototype.$setting = Setting.load()
  }
}
