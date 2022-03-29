const helpers = require('./helpers')
const login = require('../controllers/login')

const handlers = {}

handlers.notFound = (data, callback) => {
  const contentType = 'ejs'

  const payload = { template: 'errors/404', data: { emoji: '🚀', statusCode: 404, message: "You're lost." } }

  callback(404, payload, contentType)
}

handlers.index = (data, callback) => {
  const contentType = 'ejs'

  const payload = { template: 'index' }

  callback(200, payload, contentType)
}

handlers.login = async (data, callback) => {
  const contentType = 'ejs'
  let payload = {}

  if (await helpers.existSession(data.session.id)) {
    payload = { template: 'index' }
  } else if (data.method === 'get') {
    payload = { template: 'login' }
  } else if (data.method === 'post') {
    const response = await login(data)
    payload = { template: response.template, data: response.data }
  }

  callback(200, payload, contentType)
}

handlers.logout = async (data, callback) => {
  const contentType = 'ejs'

  if (await helpers.existSession(data.session.id)) {
    await helpers.deleteSession(data.session.id)
  }

  const payload = { template: 'login', data: { message: 'You have been logged out.' } }

  callback(200, payload, contentType)
}

module.exports = handlers
