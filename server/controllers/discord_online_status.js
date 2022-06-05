const { Logger } = require('betterlogger.js')
const _data = require('../lib/data')
const api = require('../api/discord_online_status')

const TWITCH_SETTINGS = {
  scope: false,
  subscriptionType: 'stream.online'
}

const logger = new Logger('discord_online_status').setDebugging(99)

const controller = {}

module.exports.index = async (data, req, res) => {
  data.titleoverwrite = '🗣️ Discord Online Status'
  data.controller.status = await api.getStatus(data, TWITCH_SETTINGS)
  data.settings = await controller.readSettings(data)

  const FORM_INPUTS = {
    toggle_controller: {
      type: 'toggle',
      label: 'Toggle Controller',
      value: data.controller.status[0] === 'Online'
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
    { html_safe: "<a href='#'>Watch Tutorial</a>" },
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

  const LEGEND_ROWS = [
    { '{user_name}': 'Twitch Username.' },
    { '{user_avatar_url}': 'Twitch Avatar URL.' },
    { '{title}': 'Twitch Title.' },
    { '{game}': 'Twitch Game.' },
    { '{time}': 'Current Time.' }
  ]

  if (req.method === 'GET') res.render('controller', { data, FORM_ROWS, LEGEND_ROWS })
  else if (req.method === 'POST') controller.saveSettings(data, req, res)
}

// eslint-disable-next-line no-multi-assign
module.exports.createDataFile = async data => {
  const fileData = {}
  const fileName = data.session.passport.user.data[0].id
  const direcotry = 'discord_online_status'
  return new Promise(resolve => {
    _data.create(direcotry, fileName, fileData, err => {
      if (err) logger.error(`user id : ${fileName} > ${err}`)
      resolve(true)
    })
  })
}

controller.readSettings = async data => {
  const fileName = data.session.passport.user.data[0].id
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
  const fileName = data.session.passport.user.data[0].id
  const direcotry = 'discord_online_status'
  const formData = req.body
  const formKeys = Object.keys(formData)

  if (formData.toggle_controller && formData.id === '') {
    await api.createSubscription(data, TWITCH_SETTINGS)
  }
  if (!formData.toggle_controller && formData.id !== '') await api.removeSubscription(data, formData.id)

  formKeys.forEach(key => {
    fileData[key] = formData[key]
  })

  return new Promise(resolve => {
    _data.update(direcotry, fileName, fileData, err => {
      if (err) logger.error(`(saveSettings) user id : ${fileName} > ${err}`)
      res.redirect('back')
      resolve(true)
    })
  })
}
