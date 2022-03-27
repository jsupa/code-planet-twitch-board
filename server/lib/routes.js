const handlers = require('./handlers')

const routes = {}

routes[''] = handlers.index
routes.notFound = handlers.notFound
routes.login = handlers.login
routes.public = handlers.public
routes.logout = handlers.logout

module.exports = routes
