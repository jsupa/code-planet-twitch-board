const request = require('request')
const { Logger } = require('betterlogger.js')

const config = require('../config')

const logger = new Logger('twitch_api').setDebugging(99)
const api = {}

api.getChannel = async user =>
  new Promise(resolve => {
    request(
      {
        url: `https://api.twitch.tv/helix/channels?broadcaster_id=${user.id}`,
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
          logger.info(
            `${res.statusCode} ${res.statusMessage} - COST : ${JSON.parse(body).total_cost}/${
              JSON.parse(body).max_total_cost
            } | Ratelimit Rremaining : ${res.headers['ratelimit-remaining']}`
          )
          // console.log(JSON.parse(body))
          // todo
          // resolve(subscription)
        }
      }
    )
  })

api.getUsers = async user =>
  new Promise(resolve => {
    request(
      {
        url: `https://api.twitch.tv/helix/users?id=${user.id}`,
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
          logger.info(
            `${res.statusCode} ${res.statusMessage} - COST : ${JSON.parse(body).total_cost}/${
              JSON.parse(body).max_total_cost
            } | Ratelimit Rremaining : ${res.headers['ratelimit-remaining']}`
          )
          // console.log(JSON.parse(body))
          // todo
          // resolve(subscription)
        }
      }
    )
  })

module.exports = api
