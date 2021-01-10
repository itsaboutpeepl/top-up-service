const config = require('config')
const axios = require('axios')

const urlBase = config.get('fuse.api.v2')
const adminJwtToken = config.get('fuse.admin.jwt')

async function mintTokensAndSendToken ({
  toAddress,
  amount
}) {
  const body = {
    ...config.get('mint.args'),
    amount,
    toAddress
  }
  return axios.post(`${urlBase}/admin/tokens/mint`, body, {
    headers: { Authorization: `Bearer ${adminJwtToken}` }
  })
}

module.exports = {
  mintTokensAndSendToken
}
