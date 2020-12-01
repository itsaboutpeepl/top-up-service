// const validator = require('validator')
const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
  walletAddress: { type: String, required: true }
})

UserSchema.index({ walletAddress: 1 }, { unique: true })

const User = model('User', UserSchema)

module.exports = User
