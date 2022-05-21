const mongoose = require("mongoose");
const User = require("./User");
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please Provide A Title"],
  },
  description: {
    type: String,
    required: [true, "Please Provide A Description"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  created_at: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
