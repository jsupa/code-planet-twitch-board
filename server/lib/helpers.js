const crypto = require('crypto')
const fs = require('fs')

const config = require('./config')

const helpers = {}

helpers.getStaticAsset = (fileName, callback) => {
  fileName = typeof fileName === 'string' && fileName.length > 0 ? fileName : false
  if (fileName) {
    const publicDir = './client/public/'
    fs.readFile(publicDir + fileName, (err, data) => {
      if (!err && data) {
        callback(false, data)
      } else {
        callback('No file could be found')
      }
    })
  } else {
    callback('A valid file name was not specified')
  }
}

helpers.hash = str => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    return hash
  } else {
    return false
  }
}

module.exports = helpers
