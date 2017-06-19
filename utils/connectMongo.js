const settings = require('../settings');
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://'+settings.username+':'+settings.pwd+'@'+settings.host+':'+settings.port+'/'+settings.db;

let db = null

module.exports = cb => {
  if (db === null) {
    MongoClient.connect(url, (err, database) => {
      if (err) {
        return cb(err)
      }
      db = database
      cb(null, db)
    })
  } else {
    cb(null, db)
  }
}