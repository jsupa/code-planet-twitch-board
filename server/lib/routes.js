const handlers = require('./handlers')

const routes = {}

routes[''] = handlers.index
routes.notFound = handlers.notFound
routes.logout = handlers.logout

module.exports = routes
