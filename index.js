const server = require('./server/lib/server')
const websocket = require('./server/lib/websocekt')

const app = {}

app.init = () => {
  server.init()
  websocket.init()
}

app.init()

module.exports = app
