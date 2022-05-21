const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

exports.addPost = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    const post = await Post.create({
      title,
      description,
      author: req.user._id,
    });

    // saving post on user schema
    req.user.posts.unshift(post);
    req.user.save();

    res.status(201).json({
      success: true,
      data: {
        "Post-ID": post._id,
        Title: post.title,
        Description: post.description,
        created_at: post.created_at.toUTCString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    await Post.deleteOne({ _id: postId });
    req.user.posts.pull(postId);

    req.user.save();
    res
      .status(200)
      .json({ success: true, message: "Post Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next(new ErrorResponse("No Such Post Exists", 400));
    }

    post.likes.unshift(req.user._id);

    await post.save();

    res.status(200).json({ success: true, message: "Post Liked Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.unlikePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    post.likes.pull(req.user._id);

    await post.save();

    res
      .status(200)
      .json({ success: true, message: "Post Unliked Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return next(new ErrorResponse("No Post Found", 400));
    }
    res.status(200).json({
      success: true,
      data: { ...post._doc, likes: post._doc.likes.length },
    });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  const user = req.user;

  try {
    const posts = await Promise.all(
      user.posts.map(async (eachPost, index) => {
        let post = await Post.findById(eachPost).populate("comments");

        return {
          ...post._doc,
          likes: post._doc.likes.length,
          created_at: post._doc.created_at.toUTCString(),
        };
      })
    );
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
