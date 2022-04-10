/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const express = require('express')
const bodyParser = require('body-parser')
const ip = require('ip')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')
const passport = require('passport')
const { Logger } = require('betterlogger.js')
// ! v buducnosti prejsť na mongo alebo redis
const JsonStore = require('express-session-json')(session)

const logger = new Logger('server').setDebugging(99)
const twitchStrategy = require('./passport-twitch').Strategy

const config = require('./config')
const routes = require('./routes')

const app = express()

const server = {}
const user = {}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser('QPyae3xxxxxxxxxxxxxxxxMcdK'))
app.use(
  session({
    secret: 'i0riQxxxxxxxxxxxxxxxRv',
    name: 'oreo',
    resave: false,
    saveUninitialized: true,
    store: new JsonStore({
      path: './data/'
    })
  })
)

app.use(express.static('./client/public'))
app.use(expressLayouts)

app.set('layout', './template')
app.set('trust proxy', true)
app.set('view engine', 'ejs')
app.set('views', './client/views')
passport.use(
  new twitchStrategy(
    {
      clientID: config.twitch.clientID,
      clientSecret: config.twitch.clientSecret,
      callbackURL: config.twitch.callbackURL,
      scope: 'user_read'
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

app.get('/auth/twitch', passport.authenticate('twitch'))

app.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/?auth=false' }), (req, res) => {
  res.redirect('/?auth=true')
  user.init(req)
})

routes.init()

app.all('*', (req, res) => {
  // server.x(req, res)
  const { headers, body, query, session, ip } = req
  session.views = session.views ? session.views + 1 : 1
  session.ip = ip
  if (!session.ips) session.ips = []
  session.ips.push(ip)
  session.ips = [...new Set(session.ips)]
  const trimmedPath = req.path.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()

  const data = {
    trimmedPath,
    headers,
    body,
    query,
    method,
    session,
    controller: {}
  }

  const choseRoute = routes[trimmedPath] || routes.notFound
  const choseHandler = data.session.passport?.user ? choseRoute : routes['']

  choseHandler(data, req, res)
  const { login, email } = session.passport?.user._json.data[0] || { login: '', email: '' }
  const allowInfo = true
  logger.request(
    `${allowInfo ? ip : '[FILTERED]'} / session views: ${session.views} - (${login}, ${
      allowInfo ? email : '[FILTERED]'
    }) > [${method}] ${res.statusCode} - /${trimmedPath} - ${JSON.stringify(body)}`
  )
})

server.init = () => {
  app.listen(config.port, () => {
    logger.debug(` Running on http://${ip.address()}:${config.port}`)
  })
}

user.init = data => {
  fs.readdir('./server/controllers', (err, files) => {
    if (!err && files) {
      files.forEach(file => {
        require(`./../controllers/${file}`).createDataFile(data)
      })
    }
  })
}

module.exports = server
