const request = require('request')
const { Logger } = require('betterlogger.js')

const config = require('../config')

const logger = new Logger('twitch_event_sub').setDebugging(99)
const eventSub = {}

eventSub.getSubscription = async (user, subscriptionType) =>
  new Promise(resolve => {
    request(
      {
        url: `https://api.twitch.tv/helix/eventsub/subscriptions?user_id=${user.data[0].id}`,
        headers: {
          'Client-ID': config.twitch.clientID,
          Authorization: `Bearer ${config.twitch.bearer}`
        }
      },
      (err, res, body) => {
        if (err) {
          logger.error(err)
          resolve(null)
        } else {
          const subscriptions = JSON.parse(body).data
          logger.info(
            `${res.statusCode} ${res.statusMessage} - COST : ${JSON.parse(body).total_cost}/${
              JSON.parse(body).max_total_cost
            } | Ratelimit Rremaining : ${res.headers['ratelimit-remaining']}`
          )

          if (subscriptions === undefined) resolve(null)
          const subscription = subscriptions?.find(sub => sub.type === subscriptionType)
          resolve(subscription)
        }
      }
    )
  })

eventSub.createSubscription = async (user, subscriptionType) =>
  new Promise(resolve => {
    const params = {
      url: 'https://api.twitch.tv/helix/eventsub/subscriptions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': config.twitch.clientID,
        Authorization: `Bearer ${config.twitch.bearer}`
      }
    }
    const body = {
      type: subscriptionType,
      version: '1',
      condition: {
        broadcaster_user_id: user.data[0].id
      },
      transport: {
        method: 'webhook',
        callback: `https://twitch-demo.code-planet.eu/api/webhook`,
        secret: config.twitch.webhookSecret
      }
    }
    request({ ...params, body: JSON.stringify(body) }, (err, res, body) => {
      if (err) {
        logger.error(err)
        resolve(null)
      } else {
        logger.info(
          `${res.statusCode} ${res.statusMessage} - COST : ${JSON.parse(body).total_cost}/${
            JSON.parse(body).max_total_cost
          } | Ratelimit Rremaining : ${res.headers['ratelimit-remaining']}`
        )
        console.log(JSON.parse(body))
        resolve(JSON.parse(body))
      }
    })
  })

module.exports = eventSub
