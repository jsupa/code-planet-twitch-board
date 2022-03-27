const _data = require('../lib/data')
const helpers = require('../lib/helpers')

const login = data =>
  new Promise(resolve => {
    const user = helpers.hash(data.body.email)
    const password = helpers.hash(data.body.password)
    let payload = {}

    _data.read('users', user, (err, userData) => {
      if (!err && userData.password === password) {
        payload = {
          template: 'index'
        }
      } else {
        payload = {
          template: 'login',
          data: {
            errorMessage: `Invalid email or password`
          }
        }
      }

      resolve(payload)
    })
  })

module.exports = login
