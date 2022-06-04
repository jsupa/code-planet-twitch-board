const crypto = require('crypto')

const config = require('./config')
const _data = require('./data')

const helpers = {}

helpers.verifySignature = req => {
  const messageID = req.header('twitch-eventsub-message-id')
  const messageTimeStamp = req.header('twitch-eventsub-message-timestamp')
  const headerSignature = req.header('twitch-eventsub-message-signature')
  const { rawBody } = req

  if (!messageID && !messageTimeStamp && !headerSignature && !rawBody) return false

  const message = messageID + messageTimeStamp + rawBody

  const signature = crypto.createHmac('sha256', config.twitch.webhookSecret).update(message).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(`sha256=${signature}`), Buffer.from(headerSignature))
}

helpers.hash = str => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    return hash
  } else {
    return false
  }
}

helpers.existSession = str =>
  new Promise(resolve => {
    _data.read('sessions', str, (err, data) => {
      if (!err && data) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })

helpers.deleteSession = str =>
  new Promise(resolve => {
    _data.delete('sessions', str, err => {
      if (!err) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })

module.exports = helpers
