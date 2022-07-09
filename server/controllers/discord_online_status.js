const { Logger } = require('betterlogger.js')

const _data = require('../lib/data')
const discord = require('../lib/discord')
const api = require('../api/discord_online_status')

const TWITCH_SETTINGS = {
  scope: false,
  subscriptionType: 'stream.online'
}
const controller = {}

controller.name = 'discord_online_status'

const logger = new Logger(`CONTROLLER ${controller.name}`).setDebugging(99)

controller.index = async (req, res) => {
  req.local.data.titleoverwrite = '🗣️ Discord Online Status'
  req.local.data.controllerStatus = await api.getStatus(req, TWITCH_SETTINGS)
  req.local.data.settings = await controller.readSettings(req)

  await await discord.checkDiscordWebhook(req)

  const FORM_INPUTS = {
    toggle_controller: {
      type: 'toggle',
      label: 'Toggle Controller',
      value: req.local.data?.controllerStatus[0] === 'Online'
    },
    discord_webhook_url: {
      type: 'link',
      placeholder: 'Discord Webhook URL',
      required: true
    },
    message_content: {
      type: 'text',
      placeholder: 'Message Content',
      required: true,
      default: 'Hi @everyone'
    },
    message_color: { type: 'color', placeholder: 'Message Color', default: '#F29595' },
    author_name: {
      type: 'text',
      placeholder: 'Author Name',
      required: true,
      default: '{user_name} is now live on Twitch!'
    },
    author_icon_url: {
      type: 'text',
      placeholder: 'Author Icon URL',
      default: '{user_avatar_url}',
      extraClass: 'input_link_css'
    },
    title: { type: 'text', placeholder: 'Title', required: true, default: '{title}' },
    description: { type: 'text', placeholder: 'Description', required: true, default: 'Playing {game}' },
    link: { type: 'link', placeholder: 'Link', default: 'https://twitch.tv/{user_name}' },
    thumbnail_url: {
      type: 'link',
      placeholder: 'Thumbnail URL',
      default: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_{user_name}-1920x1080.jpg'
    },
    footer_text: {
      type: 'text',
      placeholder: 'Footer Text',
      disabled: true,
      default: 'Made with ❤️ by www.code-planet.eu - {time}'
    },
    footer_icon_url: {
      type: 'link',
      placeholder: 'Footer Icon URL',
      disabled: true,
      default: 'https://code-planet.eu/images/Logo.png'
    }
  }

  const FORM_ROWS = [
    { toggle_controller: FORM_INPUTS.toggle_controller },
    { space: true },
    { header: 'Description' },
    { text: 'So you went live and you want everyone to know.' },
    { text: "Here's how you do it:" },
    // { html_safe: "<a href='#' class='link'>Watch Tutorial</a>" },
    { space: true },
    { header: 'Discord Webhook Url' },
    { discord_webhook_url: FORM_INPUTS.discord_webhook_url },
    { space: true },
    { header: 'Discord Webhook Settings' },
    { message_content: FORM_INPUTS.message_content },
    { message_color: FORM_INPUTS.message_color },
    { author_name: FORM_INPUTS.author_name, author_icon_url: FORM_INPUTS.author_icon_url },
    { title: FORM_INPUTS.title, description: FORM_INPUTS.description, link: FORM_INPUTS.link },
    { thumbnail_url: FORM_INPUTS.thumbnail_url },
    { footer_text: FORM_INPUTS.footer_text, footer_icon_url: FORM_INPUTS.footer_icon_url }
  ]

  // const LEGEND_ROWS = [
  //   { '{user_name}': 'Twitch Username.' },
  //   { '{user_avatar_url}': 'Twitch Avatar URL.' },
  //   { '{title}': 'Twitch Title.' },
  //   { '{game}': 'Twitch Game.' },
  //   { '{time}': 'Current Time.' }
  // ]

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

controller.update = async (req, res) => {
  const fileData = {}
  const fileName = req.user.id
  const direcotry = controller.name
  const formData = req.body
  const formKeys = Object.keys(formData)

  if (formData.toggle_controller && formData.id === '') {
    await api.createSubscription(req, TWITCH_SETTINGS)
  }
  if (!formData.toggle_controller && formData.id !== '') await api.removeSubscription(req, formData.id)

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

module.exports.methods = [
  { method: 'GET', path: '/', handler: controller.index },
  { method: 'POST', path: '/', handler: controller.update }
  // { method: 'GET', path: '/history', handler: controller.history }
]

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
