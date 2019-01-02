const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Post Model
const Post = require("../../models/Post");
// Load validations
const PostRequest = require("../../validation/post");

// @route   GET api/post/test
// @desc    Test posts route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts is working" }));

// @route   POST api/posts
// @desc    create post
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = PostRequest(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost
      .save()
      .then(post => res.json(post))
      .then(err => res.status(404).json(err));
  }
);

// @route   GET api/posts
// @desc    get all posts
// @access  public
router.get("/", (req, res) => {
  Post.find()
    .populate("user", ["name", "avatar"])
    .then(posts => {
      if (!posts) {
        errors.posts = "There is no post found";
        return res.status(404).json(errors);
      }
      res.json(posts);
    })
    .then(err => res.status(404).json(err));
});

// @route   GET api/posts/:id
// @desc    get post by id
// @access  public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }
      res.json(post);
    })
    .then(err => res.status(404).json(err));
});

// @route   Delete api/posts/:id
// @desc    get post by id
// @access  public
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (!post) {
          return res.status(404).json({ error: "post not found" });
        } else if (post.user.toSting() !== req.user.id) {
          // check authorizatrion
          return res.status(401).json({ errors: "User not authorized" });
        }
        // Delete post
        post.remove().then(() => res.json({ success: true }));
      })
      .then(err => res.status(404).json(err));
  }
);

module.exports = router;
