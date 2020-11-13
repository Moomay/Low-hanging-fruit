const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password:  {type: String},
  profile:{
    type: String
  }
})
const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel