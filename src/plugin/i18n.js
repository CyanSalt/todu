import {FileStorage} from './storage'

export default {
  install: function(Vue, options) {
    const dictionary = FileStorage.loadSync('translation') || {}
    Vue.prototype.i18n = function (message) {
      return dictionary[message] || message.split('#!')[0]
    }
  }
}
