const jwt = require('express-jwt')
const config = require('config')

const secret = config.get('api.secret')

const auth = {
  required: jwt({
    secret: secret,
    credentialsRequired: true
  }),
  optional: jwt({
    secret: secret,
    credentialsRequired: false
  })
}

module.exports = auth
