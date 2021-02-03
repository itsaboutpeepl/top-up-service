const config = require('config')
const bodyParser = require('body-parser')
const router = require('express').Router()
const { stripeClient } = require('@services/stripe')

const mongoose = require('mongoose')
const PaymentIntent = mongoose.model('PaymentIntent')
// const { mintTokensAndSendToken, generateCorrelationId } = require('@utils/fuseApi')

const generateResponse = intent => {
  // Generate a response based on the intent's status
  switch (intent.status) {
    case 'requires_action':
    case 'requires_source_action':
      // Card requires authentication
      return {
        requiresAction: true,
        clientSecret: intent.client_secret
      }
    case 'requires_payment_method':
    case 'requires_source':
      // Card was not properly authenticated, suggest a new payment method
      return {
        error: 'Your card was denied, please provide a new payment method'
      }
    case 'succeeded':
      // Payment is complete, authentication not required
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log('💰 Payment received!')
      return { clientSecret: intent.client_secret }
  }
}

router.post('/pay', async (req, res) => {
  const { amount, currency = 'gbp', paymentMethodId, walletAddress } = req.body
  console.log({ amount, currency, paymentMethodId, walletAddress })
  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      use_stripe_sdk: true
    })
    // console.log({ paymentIntent })
    await PaymentIntent({
      walletAddress,
      currency,
      amount,
      paymentMethodId,
      paymentIntentId: paymentIntent.id
    }).save()
    return res.json({
      data: { paymentIntent: generateResponse(paymentIntent) }
    })
  } catch (error) {
    console.log({ error })
    return res.json({ error })
  }
})

router.post('/webhook', bodyParser.text({ type: '*/*' }), async (req, res) => {
  let data, eventType

  if (config.get('stripe.webhookSecret')) {
    let event
    const signature = req.headers['stripe-signature']
    try {
      console.log({ signature })
      event = stripeClient.webhooks.constructEvent(
        req.body,
        signature,
        config.get('stripe.webhookSecret')
      )
      console.log({ ...event })
    } catch (err) {
      return res.sendStatus(400)
    }
    data = event.data.object
    eventType = event.type
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data
    eventType = req.body.type
  }

  if (eventType === 'payment_intent.succeeded') {
    console.log('💰 Payment captured!')
    // const { id } = data
    // const paymentIntent = await PaymentIntent.findOne({ paymentIntentId: id })
    // const correlationId = generateCorrelationId()
    // const jobRes = await mintTokensAndSendToken({
    //   correlationId,
    //   toAddress: paymentIntent.walletAddress,
    //   amount: paymentIntent.amount
    // })
    // paymentIntent.set('fuseJobId', jobRes.data._id)
    // await paymentIntent.save()
  } else if (eventType === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed.')
  }
  res.sendStatus(200)
})

module.exports = router
