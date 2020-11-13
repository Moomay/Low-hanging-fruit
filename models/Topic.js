const mongoose = require('mongoose')
const Schema = mongoose.Schema
const commentSchema = new Schema({
    username: {type: String},
    message: {type: String}
})
const topicSchema = new Schema({
  topic: {
    type: String
  },
  username: {
    type: String
  },
  comment: [commentSchema]

});
const TopicModel = mongoose.model('Topic', userSchema)

module.exports = TopicModel;