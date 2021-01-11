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
      tokenAddress: '0x40AFCD9421577407ABB0d82E2fF25Fd2Ef4c68BD'
    }
  }
}
