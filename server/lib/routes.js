/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs')
const express = require('express')
const { Logger } = require('betterlogger.js')

const handlers = require('./handlers')

const routes = {}

const logger = new Logger('routes').setDebugging(99)

// eslint-disable-next-line no-multi-assign
module.exports = routes.init = async app => {
  app.use((req, res, next) => {
    routes.reqInit(req)

    const loggerExclude = req.path.indexOf('heart_rate/api') > -1

    if (!loggerExclude)
      logger.request(
        `[HIDDEN] / session views: ${req.session.views} - (${req.user?.id}, ${req.user?.email}) > [${
          req.method
        }] /${req.path.replace(/^\/+|\/+$/g, '')} - ${JSON.stringify(req.body)}`
      )

    next()
  })

  app.get('/', handlers.index)
  app.get('/logout', handlers.logout)
  app.post('/api/webhook', handlers.webhook)

  await routes.genRoute(app)

  app.use(handlers.notFound)
}

routes.genRoute = async app =>
  new Promise(resolve => {
    fs.readdir('./server/controllers/', (err, files) => {
      if (!err && files) {
        files.forEach(file => {
          const fileName = file.split('.')[0]
          app.use(`/${fileName}`, routes.createRouter(fileName))
        })
        resolve(true)
      }
    })
  })

routes.createRouter = module => {
  const router = express.Router()

  router.use((req, res, next) => {
    next()
  })

  const moduleController = require(`./../controllers/${module}`)

  moduleController.methods.forEach(method => {
    if (method.method === 'GET') router.get(method.path, method.handler)
    else if (method.method === 'POST') router.post(method.path, method.handler)
  })

  return router
}

routes.reqInit = async req => {
  if (!req.session.views++) req.session.views = 1

  req.session.ip = req.ip

  req.user = {}

  if (req.session.passport) {
    ;[req.user] = req.session.passport.user.data
  }

  req.local = {}
  req.local.data = {}
}
