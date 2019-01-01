const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = data => {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30";
  }

  if (Validator.isEmpty(data.email) || !Validator.isEmail(data.email)) {
    errors.email = "Enter valid email address";
  }

  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must be minimum 6 charts";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
