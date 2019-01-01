const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email) || !Validator.isEmail(data.email)) {
    errors.email = "Enter valid email address";
  }

  if (isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
