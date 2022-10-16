/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs')
const express = require('express')
const { Logger } = require('betterlogger.js')

const handlers = require('./handlers')
const config = require('./config')

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
    req.user = req.session.passport.user.data
  }

  if (config.env === 'development') {
    req.user = {
      id: '113285224',
      login: 'spitik_',
      display_name: 'SpiTik_',
      type: '',
      broadcaster_type: 'affiliate',
      description:
        'Ahoj ahoj, som 21 ročný softvérový inžinier žijúci na Slovensku, prišiel som na twitch vybudovať komunitu kodérov a divákov, čo majú záujem o tech kontent. Dlhodobý projekt týchto streamov bude twitch manažment tool napísaný v node.js.',
      profile_image_url:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/f384323f-55f8-498c-bb47-d552bbdc5ebb-profile_image-300x300.png',
      offline_image_url:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/b20de8dd-fb3b-421f-9858-745d7f16c208-channel_offline_image-1920x1080.png',
      view_count: 1564,
      email: 'jakub.supa@icloud.com',
      created_at: '2016-01-19T19:38:18Z'
    }
  }

  req.local = {}
  req.local.env = config.env
  req.local.data = {}
}
