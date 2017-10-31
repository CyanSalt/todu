export default {
  methods: {
    midnight(date) {
      return new Date(`${date}T00:00:00`)
    },
    standard(date) {
      // return new Date(date).toLocaleDateString()
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    format(date, midnight) {
      if (midnight) {
        date = this.midnight(date)
      } else {
        date = new Date(date)
      }
      const format = this.i18n('%M月%D日 %W#!10')
      const days = [
        '星期日#!3', '星期一#!4', '星期二#!5', '星期三#!6',
        '星期四#!7', '星期五#!8', '星期六#!9',
      ]
      return format.replace(/%[A-Z]+/g, holder => {
        switch (holder) {
          case '%M': return date.getMonth() + 1
          case '%D': return date.getDate()
          case '%W': return this.i18n(days[date.getDay()])
          default: return holder
        }
      })
    },
    distance(date, midnight) {
      if (midnight) {
        date = this.midnight(date)
      } else {
        date = new Date(date)
      }
      const today = new Date()
      const distance = Math.floor((today - date) / 864e5)
      switch (distance) {
        case 1:
          return this.i18n('昨天#!12')
        case 2:
          return this.i18n('前天#!13')
        default:
      }
      const current = today.getDay()
      const target = date.getDay()
      const front = target && (target < current || !current)
      const days = [
        '周日#!16', '周一#!17', '周二#!18', '周三#!19',
        '周四#!20', '周五#!21', '周六#!22',
      ]
      if (distance < 7 && front) {
        return this.i18n('本%W#!14').replace('%W', this.i18n(days[target]))
      } else if (distance <= 7 || (distance < 14 && front)) {
        return this.i18n('上%W#!15').replace('%W', this.i18n(days[target]))
      }
      if (distance < 100) {
        return this.i18n('%D天前#!23').replace('%D', distance)
      }
      return this.i18n('很久以前#!24')
    },
  },
}
