const helpers = require('./helpers')
const login = require('../controllers/login')

const handlers = {}

handlers.notFound = (data, req, res) => {
  const payload = { emoji: '🚀', statusCode: 404, message: "You're lost." }

  res.status(404).render('errors/404', { data, payload })
}

handlers.index = (data, req, res) => {
  res.render('index', { data })
}

handlers.login = async (data, req, res) => {
  data.contentType = 'ejs'
  let template
  let payload = {}

  if (data.method === 'get') {
    template = 'login'
  } else if (data.method === 'post') {
    const response = await login(data)
    template = response.template
    payload = response.data
  }
  res.render(template, { data, payload })
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
