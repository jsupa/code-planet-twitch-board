const crypto = require('crypto')
const fs = require('fs')

const config = require('./config')
const _data = require('./data')

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
