/* eslint camelcase: "off" */
const config = require('config')
const router = require('express').Router()
const { plaidClient } = require('@services/plaid')
const mongoose = require('mongoose')
const UserWallet = mongoose.model('UserWallet')
const Account = mongoose.model('Account')

router.post('/set_access_token', async (req, res) => {
  const { publicToken, walletAddress } = req.body
  try {
    const user = await UserWallet.findOneAndUpdate({ walletAddress }, { $setOnInsert: { walletAddress } }, { upsert: true })
    const exchangePublicTokenResponse = await plaidClient.exchangePublicToken(publicToken)
    const { access_token, item_id } = exchangePublicTokenResponse
    const { item: { institution_id } } = await plaidClient.getItem(access_token)
    await new Account({ userId: user.id, accessToken: access_token, itemId: item_id, institutionId: institution_id }).save()
    return res.json({
      access_token,
      item_id
    })
  } catch (error) {
    return res.json({ error })
  }
})

router.post('/create_link_token_for_payment', async (req, res) => {
  try {
    const {
      walletAddress,
      value = 1,
      reference = 'Test Funding 123',
      currency = 'GBP',
      linkConfig = {
        android_package_name: 'com.itsaboutpeepl.peepl',
        products: ['payment_initiation'],
        country_codes: ['GB'],
        language: 'en',
        webhook: `${config.get('api.protocol')}://${req.headers.host}/api/plaid/webhook`
      },
      recipient_id = 'recipient-id-sandbox-358651a9-d7c9-48a1-aced-4d8d19cefc41'
    } = req.body
    const {
      android_package_name,
      products,
      country_codes,
      language,
      webhook
    } = linkConfig
    const user = await UserWallet.findOneAndUpdate({ walletAddress }, { $setOnInsert: { walletAddress } }, { upsert: true })
    const { payment_id } = await plaidClient.createPayment(
      recipient_id,
      reference,
      {
        value,
        currency
      })
    const configs = {
      user: {
        client_user_id: user.id
      },
      clientID: config.get('plaid.clientID'),
      secret: config.get('plaid.secret'),
      client_name: 'Peepl wallet',
      country_codes,
      language,
      webhook,
      payment_initiation: { payment_id },
      products,
      android_package_name
    }
    const createTokenResponse = await plaidClient.createLinkToken(configs)
    return res.json(createTokenResponse)
  } catch (error) {
    return res.json({ error })
  }
})

router.post('/webhook', async (req, res) => {
  try {
    console.log({ ...req.body })
    // Todo - handle webhook events
    console.log({ webhook: true })
  } catch (error) {
    return res.json({ error })
  }
})

module.exports = router
