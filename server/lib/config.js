const config = {}

config.port = process.env.PORT || 1337
config.wsPort = process.env.WS_PORT || 1338
config.hashingSecret = process.env.HASHING_SECRET || 'secret'

module.exports = config
