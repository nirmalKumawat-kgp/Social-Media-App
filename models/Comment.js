const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: [true, "Please Provide A text"],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
