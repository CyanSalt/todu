import {remote} from 'electron'

const Notifier = {
  send(options) {
    const {title, body} = options
    const icon = 'resource/img/icon.png'
    const notification = new Notification(title, {body, icon})
    notification.onclick = () => {
      const frame = remote.getCurrentWindow()
      if (frame.isMinimized()) {
        frame.restore()
      }
      frame.focus()
    }
    return notification
  }
}

export default {
  install(Vue, options) {
    Vue.prototype.$notifier = Notifier
  }
}
