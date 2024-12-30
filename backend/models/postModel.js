var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/instaClone");

const likesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const postSchema = new mongoose.Schema({
  caption: String,
  image: String,
  likes: [likesSchema],
  uploadedBy: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);