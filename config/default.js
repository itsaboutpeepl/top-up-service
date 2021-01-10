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
  },
  fuse: {
    api: {
      v2: 'https://studio.fuse.io/api/v2'
    },
    admin: {
      jwt: 'jwt'
    }
  },
  mint: {
    args: {
      networkType: 'fuse',
      tokenAddress: '0x52d6d59CAfc83d8c5569dF0630Db5715a96D124B'
    }
  }
}
