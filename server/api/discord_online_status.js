const eventSub = require('../lib/twitch-event-sub')

const api = {}

api.getStatus = async (data, settings) => {
  const userId = data.session.passport?.user.id
  const { subscriptionType } = settings

  const subscription = await eventSub.getSubscription(userId, subscriptionType)

  return subscription ? 'Online' : 'Offline'
}

module.exports = api
