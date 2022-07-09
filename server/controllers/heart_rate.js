const { Logger } = require('betterlogger.js')
const websocket = require('../lib/websocekt')

const _data = require('../lib/data')

const controller = {}

controller.name = 'heart_rate'

const logger = new Logger(`CONTROLLER ${controller.name}`).setDebugging(99)

controller.index = async (req, res) => {
  controller.createDataFile(req)
  req.local.data.titleoverwrite = '🫀 Heart Rate'
  req.local.data.settings = await controller.readSettings(req)

  const FORM_INPUTS = {
    apple_watch_token: {
      type: 'text',
      placeholder: 'Apple Watch Token',
      required: true
    },
    webscoket_auth_token: {
      type: 'text',
      placeholder: 'Webscoket Auth Token',
      required: true,
      default: 'W3bS0ck3t_AuTh_T0k3n'
    },
    webhook_url: {
      type: 'link',
      placeholder: 'Webhook URL',
      disabled: true
    },
    webhook_auth_token: {
      type: 'text',
      placeholder: 'Webhook Auth Token',
      disabled: true
    }
  }

  const FORM_ROWS = [
    { header: 'Description' },
    { text: 'Add your live heart rate to your broadcast. Be closer to your viewers!' },
    {
      html_safe: `<p>Add this widget url to OBS web source : <a class=link href='${controller.name}/widget/${req.user.id}/${req.local.data.settings.webscoket_auth_token}'>widget</a></p>`
    },
    { html_safe: '<a class=link href="https://testflight.apple.com/join/r57hqnpE">App on Apple Test Flight</a>' },
    { space: true },
    { text: 'Set this Watch token to your Apple Watch' },
    // { html_safe: "<a href='#' class='link'>Watch Tutorial</a>" },
    { apple_watch_token: FORM_INPUTS.apple_watch_token },
    { space: true },
    { header: 'WebSocket Settings' },
    {
      html_safe: `<p>WebSocket URL: <a>wss://twitch-demo.code-planet.eu/ws/heart_rate?userid=${req.user.id}&token=${req.local.data.settings.webscoket_auth_token}</a><p>`
    },
    { webscoket_auth_token: FORM_INPUTS.webscoket_auth_token },
    { space: true },
    { header: 'Webhook Settings' },
    { webhook_url: FORM_INPUTS.webhook_url, webhook_auth_token: FORM_INPUTS.webhook_auth_token }
  ]

  res.render('controller', { req, FORM_ROWS })
}

controller.readSettings = async req => {
  const fileName = req.user?.id
  const direcotry = controller.name

  return new Promise(resolve => {
    _data.read(direcotry, fileName, (err, fileData) => {
      if (err) logger.error(`user id : ${fileName} > ${err}`)
      resolve(fileData)
    })
  })
}

controller.readSettingsByUserId = async userId => {
  const fileName = userId
  const direcotry = controller.name

  return new Promise(resolve => {
    _data.read(direcotry, fileName, (err, fileData) => {
      if (err) logger.error(`user id : ${fileName} > ${err}`)
      resolve(fileData)
    })
  })
}

controller.update = async (req, res) => {
  const fileData = {}
  const fileName = req.user.id
  const direcotry = controller.name
  const formData = req.body
  const formKeys = Object.keys(formData)

  return new Promise(resolve => {
    formKeys.forEach(key => {
      fileData[key] = formData[key]
    })

    _data.update(direcotry, fileName, fileData, err => {
      if (err) logger.error(`(update) user id : ${fileName} > ${err}`)
      req.local.data.alert = 'Saved'
      res.redirect('back')
      resolve(true)
    })
  })
}

controller.widget = async (req, res) => {
  req.local.data.settings = await controller.readSettings(req)
  res.render('heart_rate_widget', { layout: false, req })
}

controller.createDataFile = async data => {
  const fileData = {}
  const fileName = data.session.passport.user.data[0].id
  const direcotry = controller.name

  return new Promise(resolve => {
    _data.create(direcotry, fileName, fileData, err => {
      if (err) logger.error(`user id : ${fileName} > ${err}`)
      resolve(true)
    })
  })
}

controller.heartRateApi = async (req, res) => {
  // round to 2 decimals
  const heartRate = Math.round(req.body.heartRate * 100) / 100
  websocket.sendMessage(req.params.userToken, heartRate)
  res.send('ok')
}

module.exports.methods = [
  { method: 'GET', path: '/', handler: controller.index },
  { method: 'GET', path: '/widget/:userid/:token', handler: controller.widget },
  { method: 'POST', path: '/', handler: controller.update },
  { method: 'POST', path: '/api/:userToken', handler: controller.heartRateApi }
]

module.exports.ws = async (ws, req) => {
  const url = new URL(`https://ku.bo${req.url}`)

  const userid = url.searchParams.get('userid')
  const token = url.searchParams.get('token')

  const userSettings = await controller.readSettingsByUserId(userid)

  ws.watchToken = userSettings.apple_watch_token

  if (userSettings === undefined || token !== userSettings.webscoket_auth_token) {
    ws.send(JSON.stringify({ error: 'something went wrong' }))
    ws.close()
  }

  ws.send(JSON.stringify({ heartRate: '--' }))
}
