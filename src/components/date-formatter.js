export default {
  methods: {
    midnight(date) {
      // Notice that return value of 'digitdate' might not be ISO-8601
      // for example: 2017-11-1 (should be 2017-11-01 in ISO-8601)
      // return new Date(`${date}T00:00:00`)
      return new Date(`${date} 00:00`)
    },
    digitdate(date) {
      // return new Date(date).toLocaleDateString()
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    localdate(date) {
      date = new Date(date)
      const format = this.i18n('%W, %M.%D#!10')
      const days = [
        'Sunday#!3', 'Monday#!4', 'Tuesday#!5', 'Wednesday#!6',
        'Thursday#!7', 'Friday#!8', 'Saturday#!9',
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
    localinterval(date) {
      // calculate with midnight
      date = this.midnight(date)
      const today = new Date()
      const distance = Math.floor((today - date) / 864e5)
      switch (distance) {
        case 1:
          return this.i18n('Yesterday#!12')
        case 2:
          return this.i18n('3 days ago#!13')
        default:
      }
      const current = today.getDay()
      const target = date.getDay()
      const front = target && (target < current || !current)
      const days = [
        'Sunday#!16', 'Monday#!17', 'Tuesday#!18', 'Wednesday#!19',
        'Thursday#!20', 'Friday#!21', 'Saturday#!22',
      ]
      if (distance < 7 && front) {
        return this.i18n('This %W#!14').replace('%W', this.i18n(days[target]))
      } else if (distance <= 7 || (distance < 14 && front)) {
        return this.i18n('Last %W#!15').replace('%W', this.i18n(days[target]))
      }
      if (distance < 100) {
        return this.i18n('%D days ago#!23').replace('%D', distance)
      }
      return this.i18n('Long ago#!24')
    },
  },
}
