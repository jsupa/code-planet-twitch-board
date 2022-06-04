const fs = require('fs')

const handlers = {}

handlers.notFound = (data, req, res) => {
  data.payload = { emoji: '🚀', statusCode: 404, message: "You're lost." }

  res.status(404).render('errors/404', { data })
}

handlers.index = async (data, req, res) => {
  data.plugin_buttons = await fs.promises.readdir('./server/controllers', (err, files) => files)
  res.render('index', { data })
}

handlers.logout = (data, req, res) => {
  req.session.destroy(err => {
    if (err) {
      // console.log(err)
    } else {
      res.redirect('/')
    }
  })
}

handlers.webhook = (data, req, res) => {
  // console.log(req.headers)
  // console.log(req.body)
  if (req.header('twitch-eventsub-message-type') === 'webhook_callback_verification') res.send(req.body.challenge)
  else if (req.header('twitch-eventsub-message-type') === 'notification') res.send('')
  else handlers.notFound(data, req, res)
}

module.exports = handlers
