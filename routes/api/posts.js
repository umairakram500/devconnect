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
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(401).json({ error: "delete error! Try later" })
          );
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   Post api/posts/like/:id
// @desc    Like Post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //return res.json(post);
        // if (!post) {
        //   return res.status(404).json({ error: "Post not found" });
        // } else
        if (
          post.likes.filter(like => like.user.toSting() === req.user.id)
            .length > 0
        ) {
          // check authorizatrion
          return res.status(400).json({ error: "User already like this post" });
        } else {
          // Add user id to post like array
          post.likes.unshift({ user: req.user.id });
          post
            .save()
            .then(post => res.json(post))
            .catch(err =>
              res.status(401).json({ error: "save error! Try later" })
            );
        }
      })
      .catch(err => res.status(404).json({ error: "Post Error" }));
  }
);

// @route   Post api/posts/unlike/:id
// @desc    unLike Post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        } else if (
          post.likes.filter(like => like.user.toSting() === req.user.id)
            .length === 0
        ) {
          // check user like
          return res.status(400).json({ error: "User not yet like this post" });
        }
        // find like index
        const likeIndex = post.likes
          .map(item => item.user.toSting())
          .indexOf(req.user.id);
        // remove like
        post.likes.splice(likeIndex, 1);
        // save after remove like
        post
          .save()
          .then(post => res.json(post))
          .catch(err =>
            res.status(401).json({ error: "save error! Try later" })
          );
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/posts/comment/:id
// @desc    create post
// @access  private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = PostRequest(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }

    const comment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    };

    Post.findById(req.params.id).then(post => {
      post.comments.unshift(comment);
      post.save().then(post => res.json(post));
    });
  }
);

// @route   POST api/posts/comment/:id/:comment_id
// @desc    create post
// @access  private
router.post(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      const commentIndex = post.comments
        .map(comment => comment._id.toSting())
        .indexOf(req.params.comment_id);

      post.comments.splice(commentIndex, 1);

      post.save().then(post => res.json(post));
    });
  }
);

module.exports = router;
