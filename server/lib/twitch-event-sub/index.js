const request = require('request')
const { Logger } = require('betterlogger.js')

const config = require('../config')

const logger = new Logger('twitch_event_sub').setDebugging(99)
const eventSub = {}

eventSub.getSubscription = async (user, subscriptionType) =>
  new Promise(resolve => {
    request(
      {
        url: `https://api.twitch.tv/helix/eventsub/subscriptions?type=${subscriptionType}`,
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
            `(GET ${user.id}) ${res.statusCode} ${res.statusMessage} - COST : ${JSON.parse(body).total_cost}/${
              JSON.parse(body).max_total_cost
            } | Ratelimit Rremaining : ${res.headers['ratelimit-remaining']}`
          )

          if (subscriptions === undefined) resolve(null)
          const subscription = subscriptions?.find(sub => sub.condition.broadcaster_user_id === user.id)
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
        broadcaster_user_id: user.id
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
          `(CREATE ${user.id}) ${res.statusCode} ${res.statusMessage} - COST : ${JSON.parse(body).total_cost}/${
            JSON.parse(body).max_total_cost
          } | Ratelimit Rremaining : ${res.headers['ratelimit-remaining']}`
        )
        resolve(JSON.parse(body))
      }
    })
  })

eventSub.deleteSubscription = async (user, subscriptionId) =>
  new Promise(resolve => {
    const params = {
      url: `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`,
      method: 'DELETE',
      headers: {
        'Client-ID': config.twitch.clientID,
        Authorization: `Bearer ${config.twitch.bearer}`
      }
    }
    request(params, (err, res) => {
      if (err) {
        logger.error(err)
        resolve(null)
      } else {
        logger.info(
          `(DELETE ${user.id}) ${res.statusCode} ${res.statusMessage} | Ratelimit Rremaining : ${res.headers['ratelimit-remaining']}`
        )
        resolve(res.statusCode === 204)
      }
    })
  })

module.exports = eventSub
