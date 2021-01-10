const mongoose = require('mongoose')
const { Schema } = mongoose

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: [true, "can't be blank"] },
  paymentId: { type: String, required: [true, "can't be blank"] },
  amount: { type: String, required: [true, "can't be blank"] },
  fuseJobId: { type: String }
})

PaymentSchema.index({ paymentId: 1 }, { unique: true })

const Account = mongoose.model('Payment', PaymentSchema)

module.exports = Account
