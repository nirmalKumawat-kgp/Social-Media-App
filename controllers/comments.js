const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    const comment = await Comment.create({
      comment: req.body.comment,
      author: req.user._id,
      post: postId,
    });
    post.comments.unshift(comment);
    req.user.comments.unshift(comment);
    await post.save();
    await req.user.save();
    res.json({ success: true, data: { "Comment-ID": comment._id } });
  } catch (error) {
    next(error);
  }
};
