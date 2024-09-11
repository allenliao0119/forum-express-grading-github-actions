const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: time => dayjs(time).fromNow(),
  role: isAdmin => {
    return isAdmin ? 'admin' : 'user'
  },
  toggle: boolean => {
    return !boolean
  },
  ifEqual: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifNoImage: imageUrl => imageUrl || 'https://fakeimg.pl/320x240/?text=No%20image'
}
