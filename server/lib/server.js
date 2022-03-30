/* eslint-disable no-console */
const express = require('express')
const bodyParser = require('body-parser')
const ip = require('ip')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
// ! v buducnosti prejsť na mongo alebo redis
const JsonStore = require('express-session-json')(session)

const config = require('./config')
const routes = require('./routes')

const app = express()

const server = {}

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
app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.set('views', './client/views')

app.all('*', (req, res) => {
  const { headers, body, query, session } = req
  session.views = session.views ? session.views + 1 : 1
  const trimmedPath = req.path.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()

  const choseHandler = routes[trimmedPath] || routes.notFound

  const data = {
    trimmedPath,
    headers,
    body,
    query,
    method,
    session
  }

  choseHandler(data, (statusCode, payload, contentType) => {
    contentType = typeof contentType === 'string' ? contentType : 'json'
    statusCode = typeof statusCode === 'number' ? statusCode : 200

    let payloadString = ''

    switch (contentType) {
      case 'json':
        res.setHeader('Content-Type', 'application/json')
        payload = typeof payload === 'object' ? payload : {}
        payloadString = JSON.stringify(payload)
        break
      case 'ejs':
        res.setHeader('Content-Type', 'text/html')
        res.render(payload.template, { rawData: data, data: payload.data })
        break
      case 'css':
        res.setHeader('Content-Type', 'text/css')
        payloadString = payload
        break
      case 'woff':
        res.setHeader('Content-Type', 'application/font-woff')
        payloadString = payload
        break
      default:
        res.setHeader('Content-Type', 'application/json')
        payloadString = JSON.stringify({ error: 'Content-Type not supported' })
    }

    if (contentType !== 'ejs') res.writeHead(statusCode)
    if (contentType !== 'ejs') res.end(payloadString)

    console.log(`[${method.toUpperCase()}] /${trimmedPath} (${statusCode}) - `)
  })
})

server.init = () => {
  app.listen(config.port, () => {
    console.log(`[WEB SERVER] Running on http://${ip.address()}:${config.port}`)
  })
}

module.exports = server
