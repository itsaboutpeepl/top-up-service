const mongoose = require('mongoose')
const { Schema } = mongoose

const AccountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  accessToken: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  institutionId: {
    type: String,
    required: true
  },
  institutionName: {
    type: String
  },
  accountName: {
    type: String
  },
  accountType: {
    type: String
  },
  accountSubtype: {
    type: String
  }
})

AccountSchema.index({ userId: 1, itemId: 1 }, { unique: true })

const Account = mongoose.model('Account', AccountSchema)

module.exports = Account
