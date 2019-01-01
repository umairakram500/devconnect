const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validator
const ValidateRegisterInput = require("../../validation/register");
const ValidateLoginInput = require("../../validation/login");

// load user model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "User works" }));

// @route   GET api/users/register
// @desc    Uer register
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = ValidateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: "Email already exists!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        //res.status(400).json(salt);
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(400).json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Uer Login / Retrun JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = ValidateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    // check user
    if (!user) {
      return res.status(404).json({ email: "user not found" });
    }

    // check passowrd
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "password not match" });
      }
    });
  });
});

// @route   GET api/users/login
// @desc    Uer Login / Retrun JWT Token
// @access  Public
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
  }
);

module.exports = router;
