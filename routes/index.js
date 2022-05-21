const express = require("express");
const { authenticateUser } = require("../controllers/auth");
const { addComment } = require("../controllers/comments");
const {
  addPost,
  deletePost,
  likePost,
  unlikePost,
  getPost,
  getPosts,
} = require("../controllers/posts");
const { followUser, unfollowUser, getUser } = require("../controllers/user");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/test", (req, res) => {
  console.log("Welcome To API");
});

// All endpoints related to User
router.route("/authenticate").post(authenticateUser);
router.route("/follow/:userId").post(isAuthenticated, followUser);
router.route("/unfollow/:userId").post(isAuthenticated, unfollowUser);
router.route("/user").get(isAuthenticated, getUser);

//All endpoints related to Post
router.route("/posts").post(isAuthenticated, addPost);
router.route("/posts/:postId").delete(isAuthenticated, deletePost);
router.route("/like/:postId").post(isAuthenticated, likePost);
router.route("/unlike/:postId").post(isAuthenticated, unlikePost);
router.route("/posts/:postId").get(getPost);
router.route("/all_posts").get(isAuthenticated, getPosts);

//All endpoints related to comment
router.route("/comment/:postId").post(isAuthenticated, addComment);

module.exports = router;
