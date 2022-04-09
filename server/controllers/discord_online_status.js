const { Logger } = require('betterlogger.js')
const _data = require('../lib/data')

const logger = new Logger('discord_online_status').setDebugging(99)

const controller = {}

module.exports.index = async (data, req, res) => {
  data.titleoverwrite = '🗣️ Discord Online Status'
  res.render('index', { data })
}

module.exports.settings = async (data, req, res) => {
  data.settings = await controller.readSettings(data)
  data.titleoverwrite = '🪛 Discord Embed Settings'

  const FORM_INPUTS = {
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
    author_icon_url: { type: 'text', placeholder: 'Author Icon URL', required: true, default: '{user_avatar_url}' },
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
  const LEGEND_ROWS = [
    { '{user_name}': 'Twitch Username.' },
    { '{user_avatar_url}': 'Twitch Avatar URL.' },
    { '{title}': 'Twitch Title.' },
    { '{game}': 'Twitch Game.' },
    { '{time}': 'Current Time.' }
  ]

  if (req.method === 'GET') res.render('settings', { data, FORM_ROWS, LEGEND_ROWS })
  else if (req.method === 'POST') controller.saveSettings(data, req, res)
}

// eslint-disable-next-line no-multi-assign
module.exports.createDataFile = async data => {
  const fileData = {}
  const fileName = data.session.passport.user.id
  const direcotry = 'discord_online_status'
  return new Promise(resolve => {
    _data.create(direcotry, fileName, fileData, err => {
      if (err) logger.error(`user id : ${fileName} > ${err}`)
      resolve(true)
    })
  })
}

controller.readSettings = async data => {
  const fileName = data.session.passport.user.id
  const direcotry = 'discord_online_status'
  return new Promise(resolve => {
    _data.read(direcotry, fileName, (err, fileData) => {
      if (err) logger.error(`user id : ${fileName} > ${err}`)
      resolve(fileData)
    })
  })
}

controller.saveSettings = async (data, req, res) => {
  const fileData = {}
  const fileName = data.session.passport.user.id
  const direcotry = 'discord_online_status'
  const formData = req.body
  const formKeys = Object.keys(formData)
  formKeys.forEach(key => {
    fileData[key] = formData[key]
  })
  return new Promise(resolve => {
    _data.update(direcotry, fileName, fileData, err => {
      if (err) logger.error(`user id : ${fileName} > ${err}`)
      res.redirect('back')
      resolve(true)
    })
  })
}
