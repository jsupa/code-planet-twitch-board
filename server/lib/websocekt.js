const webSocket = require('ws')
const ip = require('ip')
const { Logger } = require('betterlogger.js')
const config = require('./config')

const server = {}

const logger = new Logger('websocket').setDebugging(99)
const wss = new webSocket.Server({ port: config.wsPort })

wss.on('connection', (ws, req) => {
  const auth = req.headers.authtoken === 'someoken'

  if (!auth) ws.close()

  const message = { status: 'success', message: 'hello' }
  ws.send(JSON.stringify(message))
})

server.init = () => {
  logger.debug(`Running on http://${ip.address()}:${config.wsPort}`)
}

module.exports = server
