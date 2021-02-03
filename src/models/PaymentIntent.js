const mongoose = require('mongoose')
const { Schema } = mongoose

const PaymentIntentSchema = new Schema({
  walletAddress: { type: String, required: true },
  paymentMethodId: { type: String, required: [true, "can't be blank"] },
  paymentIntentId: { type: String, required: [true, "can't be blank"] },
  amount: { type: String, required: [true, "can't be blank"] },
  currency: { type: String },
  fuseJobId: { type: String }
})

PaymentIntentSchema.index({ paymentIntentId: 1, walletAddress: 1 }, { unique: true })

const PaymentIntent = mongoose.model('PaymentIntent', PaymentIntentSchema)

module.exports = PaymentIntent
