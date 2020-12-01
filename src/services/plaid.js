const plaid = require('plaid')
const config = require('config')

const plaidClient = new plaid.Client({
  clientID: config.get('clientID'),
  secret: config.get('secret'),
  env: plaid.environments.sandbox
})

module.exports = {
  plaidClient
}
