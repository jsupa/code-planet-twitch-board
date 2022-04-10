const request = require('request')
const { Logger } = require('betterlogger.js')

const config = require('../config')

const logger = new Logger('twitch_event_sub').setDebugging(99)
const eventSub = {}

eventSub.getSubscription = async (userId, subscriptionType) =>
  new Promise(resolve => {
    request(
      {
        url: `https://api.twitch.tv/helix/eventsub/subscriptions?user_id=${userId}`,
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
          if (subscriptions.length === 0) resolve(null)
          const subscription = subscriptions.find(sub => sub.type === subscriptionType)
          resolve(subscription)
        }
      }
    )
  })

module.exports = eventSub
