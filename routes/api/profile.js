const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passprot = require("passport");

// Loads Profile Model
const Profile = require("../../models/Profile");
// Loads User Model
const User = require("../../models/User");
// Load Input Validator
const ValidateProfileInput = require("../../validation/profile");
const ExperienceRequest = require("../../validation/experience");
const EducationRequest = require("../../validation/education");

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get(
  "/",
  passprot.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all/
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There is no profiles";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profiles: "There is no profile" }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get the profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => console.log(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get the profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
  Profile.findOne({ handle: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user ID." })
    );
});

// @route   POST api/profile
// @desc    Create User Profile
// @access  Private
router.post(
  "/",
  passprot.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidateProfileInput(req.body);
    // Check validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    const data = req.body;
    const profileFields = {};

    // Get the fields
    profileFields.user = req.user.id;

    if (data.handle) profileFields.handle = data.handle;
    if (data.company) profileFields.company = data.company;
    if (data.website) profileFields.website = data.website;
    if (data.location) profileFields.location = data.location;
    if (data.bio) profileFields.bio = data.bio;
    if (data.status) profileFields.status = data.status;
    if (data.githubusername) profileFields.githubusername = data.githubusername;

    // Skills - split to array
    if (typeof data.skills !== "undefined" && data.skills !== null) {
      profileFields.skills = data.skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (data.youtube) profileFields.social.youtube = data.youtube;
    if (data.twitter) profileFields.social.twitter = data.twitter;
    if (data.facebook) profileFields.social.facebook = data.facebook;
    if (data.linkedin) profileFields.social.linkedin = data.linkedin;
    if (data.instragram) profileFields.social.instragram = data.instragram;
    //return res.json(profileFields);
    Profile.findOne({ user: profileFields.user }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: profileFields.user },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          } else {
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile))
              .catch(err => {
                errors.save = "save error";
                res.status(404).json(errors);
              });
          }
        });
      }
    });
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to  User Profile
// @access  Private
router.post(
  "/experience",
  passprot.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ExperienceRequest(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add new Exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile)).catch(err => {
        errors.save = "save error";
        res.status(404).json(errors);
      });
    });
  }
);

// @route   POST api/profile/education
// @desc    Add education to User Profile
// @access  Private
router.post(
  "/education",
  passprot.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = EducationRequest(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        // Add new Exp array
        profile.education.unshift(newEdu);

        profile.save().then(profile => res.json(profile)).catch(err => {
          errors.save = "save error";
          res.status(404).json(errors);
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   Delete api/profile/experience/:exp_id
// @desc    Delete experience to User Profile
// @access  Private
router.post(
  "/experience/:exp_id",
  passprot.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile)).catch(err => {
          errors.save = "save error";
          res.status(404).json(errors);
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   Delete api/profile/education/:edu_id
// @desc    Delete education to User Profile
// @access  Private
router.post(
  "/education/:edu_id",
  passprot.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile)).catch(err => {
          errors.save = "save error";
          res.status(404).json(errors);
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
