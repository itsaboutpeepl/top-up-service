require('./Account')
require('./User')
require('./Payment')
require('./PaymentIntent')

module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  return mongoose
}
