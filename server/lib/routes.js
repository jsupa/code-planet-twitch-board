const handlers = require('./handlers')

const routes = {}

routes[''] = handlers.index
routes.notFound = handlers.notFound
routes.login = handlers.login
routes.logout = handlers.logout

module.exports = routes
