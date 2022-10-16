const webSocket = require('ws')
const ip = require('ip')
const { Logger } = require('betterlogger.js')
const config = require('./config')

const server = {}

const logger = new Logger('websocket').setDebugging(99)
const wss = new webSocket.Server({ port: config.wsPort })

wss.on('connection', (ws, req) => {
  const controller = req.url.split('/')[2].split('/')[0]

  // eslint-disable-next-line import/no-dynamic-require, global-require
  require(`./../controllers/${controller}`).ws(ws, req)

  // const message = { status: 'success', message: 'hello' }
  // ws.send(JSON.stringify(message))

  // ws.on('message', message => {
  //   console.log(message.toString())
  // })
})

server.sendMessage = (watchToken, heartRate) => {
  wss.clients.forEach(client => {
    if (client.watchToken === watchToken) {
      client.send(JSON.stringify({ heartRate }))
    }
  })
}

server.init = () => {
  logger.info(`Running on ws://${ip.address()}:${config.wsPort}`)
}

module.exports = server
