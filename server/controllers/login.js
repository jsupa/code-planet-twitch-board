const _data = require('../lib/data')
const helpers = require('../lib/helpers')

const login = data =>
  new Promise(resolve => {
    const user = helpers.hash(data.body.email)
    _data.read('users', user, (err, userData) => {
      if (!err && userData) {
        resolve({ errorMessage: userData.username })
      } else {
        resolve({ errorMessage: 'Invalid email or password' })
      }
    })
  })

module.exports = login
