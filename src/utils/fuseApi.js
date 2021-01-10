const config = require('config')
const axios = require('axios')

const urlBase = config.get('fuse.api.v2')
const adminJwtToken = config.get('fuse.admin.jwt')

function generateCorrelationId () {
  return '_' + Math.random().toString(36).substr(2, 9)
}

async function mintTokensAndSendToken ({
  toAddress,
  amount,
  correlationId
}) {
  const body = {
    ...config.get('mint.args'),
    correlationId,
    amount,
    toAddress
  }
  return axios.post(`${urlBase}/admin/tokens/mint`, body, {
    headers: { Authorization: `Bearer ${adminJwtToken}` }
  })
}

module.exports = {
  mintTokensAndSendToken,
  generateCorrelationId
}
