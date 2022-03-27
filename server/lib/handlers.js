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
  let payload

  if (data.method === 'get') {
    payload = { template: 'login' }
  } else if (data.method === 'post') {
    payload = { template: 'login', data: await login(data) }
  }

  callback(200, payload, contentType)
}

handlers.public = (data, callback) => {
  if (data.method === 'get') {
    const trimmedAssetName = data.trimmedPath.replace('public/', '').trim()
    if (trimmedAssetName.length > 0) {
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && data) {
          let contentType = 'plain'
          switch (trimmedAssetName.split('.').pop()) {
            case 'css':
              contentType = 'css'
              break
            case 'woff':
              contentType = 'woff'
              break
            default:
              contentType = 'plain'
          }
          callback(200, data, contentType)
        } else {
          callback(404)
        }
      })
    }
  }
}

module.exports = handlers
