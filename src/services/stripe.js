const config = require('config')
const stripeClient = require('stripe')(config.get('stripe.secret'))

module.exports = {
  stripeClient
}
