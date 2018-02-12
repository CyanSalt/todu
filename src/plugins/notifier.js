import {remote} from 'electron'

const Notifier = {
  send(options) {
    const {title, body} = options
    const icon = 'assets/images/icon.png'
    const frame = remote.getCurrentWindow()
    frame.flashFrame(true)
    const notification = new Notification(title, {body, icon})
    notification.onclick = () => {
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
