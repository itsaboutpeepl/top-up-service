module.exports = {
  api: {
    allowCors: true,
    secret: 'secret',
    protocol: 'http',
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
