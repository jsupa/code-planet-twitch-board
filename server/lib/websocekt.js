/* eslint-disable no-console */
const webSocket = require('ws')
const ip = require('ip')
const config = require('./config')

const server = {}

const wss = new webSocket.Server({ port: config.wsPort })

wss.on('connection', (ws, req) => {
  const auth = req.headers.authtoken === 'someoken'

  if (!auth) ws.close()

  const message = { status: 'success', message: 'hello' }
  ws.send(JSON.stringify(message))
})

server.init = () => {
  console.log(`[WS SERVER] Running on http://${ip.address()}:${config.wsPort}`)
}

module.exports = server
