const plaid = require('plaid')
const config = require('config')

const plaidClient = new plaid.Client({
  clientID: config.get('plaid.clientID'),
  secret: config.get('plaid.secret'),
  env: plaid.environments.sandbox // plaid.environments[config.get('plaid.env')]
})

module.exports = {
  plaidClient
}
