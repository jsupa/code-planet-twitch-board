const fs = require('fs')

const _data = {}

_data.baseDir = './data/'

_data.read = (dir, file, callback) => {
  fs.readFile(`${_data.baseDir + dir}/${file}.json`, 'utf-8', (err, data) => {
    if (!err && data) {
      const parsedData = JSON.parse(data)
      callback(false, parsedData)
    } else {
      callback(err, data)
    }
  })
}

_data.update = (dir, file, data, callback) => {
  fs.open(`${_data.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data)
      fs.ftruncate(fileDescriptor, err => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false)
                } else {
                  callback('Error closing existing file')
                }
              })
            } else {
              callback('Error writing to existing file')
            }
          })
        } else {
          callback('Error truncating file')
        }
      })
    } else {
      callback('Could not open the file for updating, it may not exist yet')
    }
  })
}

_data.create = (dir, file, data, callback) => {
  if (!fs.existsSync(_data.baseDir + dir)) {
    fs.mkdirSync(_data.baseDir + dir)
  }
  fs.open(`${_data.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data)
      fs.writeFile(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              callback(false)
            } else {
              callback('Error closing new file')
            }
          })
        } else {
          callback('Error writing to new file')
        }
      })
    } else {
      callback('Could not create new file, it may already exist')
    }
  })
}

_data.delete = (dir, file, callback) => {
  fs.unlink(`${_data.baseDir + dir}/${file}.json`, err => {
    if (!err) {
      callback(false)
    } else {
      callback('Error deleting file')
    }
  })
}

module.exports = _data
