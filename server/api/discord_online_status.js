const eventSub = require('../lib/twitch-event-sub')

const api = {}

api.getStatus = async (data, settings) => {
  const user = data.session.passport?.user
  const { subscriptionType } = settings

  const subscription = await eventSub.getSubscription(user, subscriptionType)
  return subscription.status === 'enabled' ? ['Online', subscription.id] : ['Offline', null]
}

api.createSubscription = async (data, settings) => {
  const user = data.session.passport?.user
  const { subscriptionType } = settings
  await eventSub.createSubscription(user, subscriptionType)
  return true
}

module.exports = api
