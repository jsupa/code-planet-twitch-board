const fs = require('fs')

const helpers = require('./helpers')

const handlers = {}

handlers.notFound = (req, res) => {
  req.local.data.payload = { emoji: '🚀', statusCode: 404, message: "You're lost." }

  res.status(404).render('errors/404', { req })
}

handlers.index = async (req, res) => {
  req.local.data.plugin_buttons = await fs.promises.readdir('./server/controllers', (err, files) => files)
  res.render('index', { req })
}

handlers.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      // console.log(err)
    } else {
      res.redirect('/')
    }
  })
}

handlers.webhook = (req, res) => {
  if (!helpers.verifySignature(req)) handlers.notFound(req, res)
  else if (req.header('twitch-eventsub-message-type') === 'webhook_callback_verification') res.send(req.body.challenge)
  else if (req.header('twitch-eventsub-message-type') === 'notification') res.send('OK')
  else handlers.notFound(req, res)
}

module.exports = handlers
