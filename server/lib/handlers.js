const handlers = {}

handlers.notFound = (data, callback) => {
  const json = data.query.json !== undefined
  const contentType = json ? 'json' : 'ejs'

  const dataJson = { error: '🔎 Not found' }
  const dataPug = { template: 'errors/404', data: { message: '🔎 Not found' } }

  const payload = json ? dataJson : dataPug

  callback(404, payload, contentType)
}

handlers.index = (data, callback) => {
  callback(200, { message: 'Hello Planet 🪐' }, 'json')
}

module.exports = handlers
