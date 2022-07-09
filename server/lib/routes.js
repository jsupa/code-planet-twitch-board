/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs')
const express = require('express')
const { Logger } = require('betterlogger.js')

const handlers = require('./handlers')

const routes = {}

const logger = new Logger('routes').setDebugging(99)

routes.init = async app => {
  app.use((req, res, next) => {
    if (!req.session.views++) req.session.views = 1
    req.session.ip = req.ip
    if (!req.session.ips) req.session.ips = []
    req.session.ips.push(req.ip)
    req.User = () => {
      if (req.session.passport) {
        return {
          id: req.session.passport.user.data[0].id,
          login: req.session.passport.user.data[0].login,
          displayName: req.session.passport.user.data[0].display_name,
          email: req.session.passport.user.data[0].email,
          avatar: req.session.passport.user.data[0].profile_image_url,
          accessToken: req.session.passport.user.accessToken,
          refreshToken: req.session.passport.user.refreshToken
        }
      } else {
        return null
      }
    }
    req.local = {}
    req.local.data = {}

    req.Data = () => req.local.data

    const loggerExclude = req.path.indexOf('heart_rate/api') > -1

    if (!loggerExclude)
      logger.request(
        `[HIDDEN] / session views: ${req.session.views} - (${req.User()?.id}, ${req.User()?.email}) > [${
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

module.exports = routes
