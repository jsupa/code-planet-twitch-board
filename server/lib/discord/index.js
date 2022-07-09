const request = require('request')
const { Logger } = require('betterlogger.js')
const { MessageEmbed, WebhookClient } = require('discord.js')

// const config = require('../config')

const logger = new Logger('discord').setDebugging(99)
const discord = {}

discord.checkDiscordWebhook = async req =>
  new Promise(resolve => {
    request(
      {
        url: req.local.data?.settings.discord_webhook_url
      },
      (err, res, body) => {
        if (err) {
          logger.error(err)
          resolve(null)
        } else if (res.headers['content-type'] !== 'application/json') {
          logger.error(
            `(GET ${req.user.id}) ${res.statusCode} ${res.statusMessage} - INVALID CONTENT TYPE : ${res.headers['content-type']}`
          )
          req.local.data.alert = 'Invalid Discord Webhook URL'
          resolve(null)
        } else {
          const parsedBody = JSON.parse(body)
          logger.info(
            `(GET ${req.user.id}) ${res.statusCode} ${res.statusMessage} - ${parsedBody.message || parsedBody.id}`
          )
          if (!parsedBody.id) req.local.data.alert = parsedBody.message || 'Invalid Discord Webhook URL'
          resolve(true)
        }
      }
    )
  })

discord.sendDiscordWebhook = async (data, webhookBody) =>
  new Promise(resolve => {
    const webhookClient = new WebhookClient({ url: data.settings.discord_webhook_url })

    const embed = new MessageEmbed()
      .setTitle(webhookBody.title) // 💻 Twitch board | TOP D. Gabi, Maciak 💸
      .setColor(webhookBody.color) // #0099ff
      .setDescription(webhookBody.description) // \nPlaying Veda a technológia\n\n[Watch Stream](https://twitch.tv/spitik/)
      .setImage(webhookBody.thumbnail_url) // https://static-cdn.jtvnw.net/previews-ttv/live_user_spitik-1920x1080.jpg
      .setAuthor({
        name: webhookBody.author_name, // 💻 Twitch board | TOP D. Gabi, Maciak 💸
        iconURL: webhookBody.author_icon_url, // https://static-cdn.jtvnw.net/jtv_user_pictures/spitik-profile_image-c5c9c9b8c9b7e7e5-300x300.png
        url: webhookBody.link // https://twitch.tv/spitik/
      })
      .setFooter({ text: 'Made with ❤️ by www.code-planet.eu', iconURL: 'https://code-planet.eu/images/Logo.png' })
      .setTimestamp()
      .setURL(webhookBody.link) // https://twitch.tv/spitik/

    webhookClient
      .send({
        content: webhookBody.message_content, // Hi @everyone
        ephemeral: true,
        embeds: [embed]
      })
      .then(() => {
        logger.info('Webhook sent')
        resolve(true)
      })
  })

module.exports = discord
