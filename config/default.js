module.exports = {
  api: {
    allowCors: true,
    secret: 'secret',
    port: 3000
  },
  mongo: {
    debug: true,
    uri: 'mongodb://localhost/plaid'
  },
  plaid: {
    clientID: 'clientId',
    secret: 'secret',
    env: 'sandbox'
  }
}
