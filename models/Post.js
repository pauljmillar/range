const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  author   : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  slug: { type: String, unique: true }, //url value
  description: String,
  text: String,
  active: { type: Boolean, default: false},
  tags: String
  
}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
