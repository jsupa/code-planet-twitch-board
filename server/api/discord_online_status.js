const eventSub = require('../lib/twitch-event-sub')

const api = {}

api.getStatus = async (req, settings) => {
  const { user } = req
  const { subscriptionType } = settings

  const subscription = await eventSub.getSubscription(user, subscriptionType)

  if (subscription?.status === 'enabled') return ['Online', subscription.id]
  else if (subscription?.status === 'webhook_callback_verification_pending')
    return ['Pending, (try refresh)', subscription.id]
  else return ['Offline', null]
}

api.createSubscription = async (req, settings) => {
  const { user } = req
  const { subscriptionType } = settings
  await eventSub.createSubscription(user, subscriptionType)
  return true
}

api.removeSubscription = async (req, webhookId) => {
  const { user } = req
  await eventSub.deleteSubscription(user, webhookId)
  return true
}

module.exports = api
