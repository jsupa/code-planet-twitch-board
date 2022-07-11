/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const ip = require('ip')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const { OAuth2Strategy } = require('passport-oauth')
const { Logger } = require('betterlogger.js')
// ! v buducnosti prejsť na mongo alebo redis
const JsonStore = require('express-session-json')(session)

const logger = new Logger('server').setDebugging(99)

const config = require('./config')
const routes = require('./routes')

const app = express()

const server = {}

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  })
)

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
app.use(passport.initialize())
app.use(passport.session())

app.set('layout', './template')
app.set('trust proxy', true)
app.set('view engine', 'ejs')
app.set('views', './client/views')

if (config.env === 'production') {
  OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
    const options = {
      url: 'https://api.twitch.tv/helix/users',
      method: 'GET',
      headers: {
        'Client-ID': config.twitch.clientID,
        Accept: 'application/vnd.twitchtv.v5+json',
        Authorization: `Bearer ${accessToken}`
      }
    }

    request(options, (error, response, body) => {
      if (response && response.statusCode === 200) {
        done(null, JSON.parse(body))
      } else {
        done(JSON.parse(body))
      }
    })
  }

  passport.use(
    'twitch',
    new OAuth2Strategy(
      {
        authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
        tokenURL: 'https://id.twitch.tv/oauth2/token',
        clientID: config.twitch.clientID,
        clientSecret: config.twitch.clientSecret,
        callbackURL: config.twitch.callbackURL,
        state: true
      },
      (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken
        profile.refreshToken = refreshToken

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

  app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }))

  app.get(
    '/auth/twitch/callback',
    passport.authenticate('twitch', { failureRedirect: '/?auth=false', successRedirect: '/' })
  )
}

server.init = () => {
  routes(app)

  app.listen(config.port, () => {
    logger.debug(` Running on http://${ip.address()}:${config.port}`)
  })
}

module.exports = server
