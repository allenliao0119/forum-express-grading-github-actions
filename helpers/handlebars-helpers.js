const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  role: isAdmin => {
    return isAdmin ? 'admin' : 'user'
  },
  toggle: boolean => {
    return !boolean
  }
}
