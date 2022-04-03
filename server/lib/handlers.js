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
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
}

module.exports = handlers
