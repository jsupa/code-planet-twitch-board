const { Logger } = require('betterlogger.js')

const config = require('./config')

const mongo = {}

const logger = new Logger('mongo').setDebugging(99)

// eslint-disable-next-line no-multi-assign
module.exports = mongo.init = async mongoose => {
  mongoose.connect(config.mongo, (err, db) => {
    if (err) {
      logger.error(`Error connecting to the database. ${err}`)
    } else {
      logger.info(`Connected to Database: ${db.name}`)
    }
  })
}
