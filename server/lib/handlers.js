const handlers = {}

handlers.notFound = (data, req, res) => {
  const payload = { emoji: '🚀', statusCode: 404, message: "You're lost." }

  res.status(404).render('errors/404', { data, payload })
}

handlers.index = (data, req, res) => {
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
