const plaid = require('plaid')
const config = require('config')

console.log({ plaidSecret: config.get('plaid.secret') })
console.log({ plaidClientId: config.get('plaid.clientID') })

const plaidClient = new plaid.Client({
  clientID: config.get('plaid.clientID'),
  secret: config.get('plaid.secret'),
  env: plaid.environments.sandbox
})

module.exports = {
  plaidClient
}
