/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs')
const handlers = require('./handlers')

const routes = {}

routes[''] = handlers.index
routes.notFound = handlers.notFound
routes.logout = handlers.logout

routes.init = async () => {
  await fs.readdir('./server/controllers', (err, files) => {
    if (!err && files) {
      files.forEach(file => {
        const fileName = file.split('.')[0]
        routes[fileName] = require(`./../controllers/${file}`).index
        routes[`settings/${fileName}`] = require(`./../controllers/${file}`).settings
      })
    }
  })
}

module.exports = routes
