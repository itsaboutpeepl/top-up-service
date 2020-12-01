require('./Account')
require('./User')

module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  return mongoose
}
