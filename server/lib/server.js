/* eslint-disable no-console */
const express = require('express')
const bodyParser = require('body-parser')
const ip = require('ip')

const config = require('./config')
const routes = require('./routes')

const app = express()

const server = {}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './client/views')

app.all('*', (req, res) => {
  const { headers, body, query } = req
  const trimmedPath = req.path.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()

  const choseHandler = routes[trimmedPath] || routes.notFound

  const data = {
    trimmedPath,
    headers,
    body,
    query,
    method
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
        res.render(payload.template, payload.data)
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
