const request = require('request')
const { Logger } = require('betterlogger.js')

// const config = require('../config')

const logger = new Logger('discord').setDebugging(99)
const discord = {}

discord.checkDiscordWebhook = async data =>
  new Promise(resolve => {
    request(
      {
        url: data.settings.discord_webhook_url
      },
      (err, res, body) => {
        if (err) {
          logger.error(err)
          resolve(null)
        } else if (res.headers['content-type'] !== 'application/json') {
          logger.error(`${res.statusCode} ${res.statusMessage} - INVALID CONTENT TYPE : ${res.headers['content-type']}`)
          data.alert = 'Invalid Discord Webhook URL'
          resolve(null)
        } else {
          logger.info(`${res.statusCode} ${res.statusMessage} - ${body}`)
          const parsedBody = JSON.parse(body)
          if (!parsedBody.id) data.alert = parsedBody.message || 'Invalid Discord Webhook URL'
          resolve(true)
        }
      }
    )
  })

module.exports = discord
