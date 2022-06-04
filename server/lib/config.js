const config = {}
config.twitch = {}

config.port = process.env.PORT || 1337
config.wsPort = process.env.WS_PORT || 1338
config.hashingSecret = process.env.HASHING_SECRET || 'secret'
config.twitch.clientID = process.env.TWITCH_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
config.twitch.clientSecret = process.env.TWITCH_CLIENT_SECRET || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
config.twitch.bearer = process.env.TWITCH_CLIENT_BEARER || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
config.twitch.callbackURL = process.env.TWITCH_CALLBACK_URL || 'http://localhost:1337/auth/twitch/callback'
config.twitch.webhookSecret = process.env.TWITCH_WEBHOOK_SECRET || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

module.exports = config
