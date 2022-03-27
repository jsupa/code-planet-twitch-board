const _data = require('../lib/data')
const helpers = require('../lib/helpers')

const handlers = {}

const login = data =>
  new Promise(resolve => {
    const user = helpers.hash(data.body.email)
    const password = helpers.hash(data.body.password)
    let payload = {}

    _data.read('users', user, (err, userData) => {
      if (!err && userData.password === password) {
        handlers.saveSession(data)
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

handlers.saveSession = data => {
  const sessionId = data.session.id
  const user = helpers.hash(data.body.email)
  const now = Date.now()

  const object = {
    created_at: now,
    last_used: now,
    user
  }

  _data.create('sessions', sessionId, object, err => {
    if (!err) {
      console.log('Session saved successfully')
    } else {
      console.log(`Error saving session: ${err}`)
    }
  })
}

module.exports = login
