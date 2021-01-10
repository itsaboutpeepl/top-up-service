/* eslint camelcase: "off" */
const config = require('config')
const router = require('express').Router()
const { plaidClient } = require('@services/plaid')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Account = mongoose.model('Account')
const Payment = mongoose.model('Payment')
const { mintTokensAndSendToken, generateCorrelationId } = require('@utils/fuseApi')

router.post('/set_access_token', async (req, res) => {
  const { publicToken, walletAddress } = req.body
  try {
    const user = await User.findOneAndUpdate({ walletAddress }, { $setOnInsert: { walletAddress } }, { upsert: true })
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
      // recipient_id = 'recipient-id-development-4b0570e4-3676-4b6d-8ac3-8a2fd99bc897'
      recipient_id = 'recipient-id-sandbox-358651a9-d7c9-48a1-aced-4d8d19cefc41'
    } = req.body
    const {
      android_package_name,
      products,
      country_codes,
      language,
      webhook
    } = linkConfig
    const user = await User.findOneAndUpdate({ walletAddress }, { $setOnInsert: { walletAddress } }, { upsert: true })
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
      client_name: 'Peepl wallet',
      country_codes,
      language,
      webhook,
      payment_initiation: { payment_id },
      products,
      android_package_name
    }
    await new Payment({ userId: user.id, paymentId: payment_id, amount: value }).save()
    const createTokenResponse = await plaidClient.createLinkToken(configs)
    return res.json(createTokenResponse)
  } catch (error) {
    return res.json({ error })
  }
})

router.post('/webhook', async (req, res) => {
  console.log({ ...req.body })
  const {
    payment_id,
    new_payment_status,
    old_payment_status,
    error
  } = req.body
  try {
    if (old_payment_status === 'PAYMENT_STATUS_PROCESSING' && new_payment_status === 'PAYMENT_STATUS_INITIATED') {
      const payment = await Payment.findOne({ paymentId: payment_id })
      const user = await User.findById(payment.userId)
      const { data } = await mintTokensAndSendToken({
        correlationId: generateCorrelationId(),
        toAddress: user.walletAddress,
        amount: payment.amount
      })
      console.log({ ...data })
      payment.set('fuseJobId', data._id)
      await payment.save()
      return res.json({ data })
    }
  } catch (e) {
    return res.json({ error })
  }
})

module.exports = router
