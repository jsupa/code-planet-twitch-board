const handlers = require('./handlers')

const routes = {}

routes[''] = handlers.index
routes.notFound = handlers.notFound
routes.login = handlers.login
routes.public = handlers.public

module.exports = routes
