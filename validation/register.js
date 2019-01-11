const Validator = require("validatorjs");

module.exports = data => {
  const rules = {
    name: "required|string|min:5|max:30",
    email: "required|email",
    password: "required|min:6",
    password2: "required|same:password"
  };
  const attrNames = {
    name: "Name",
    email: "Email",
    password: "Password",
    password2: "Confirm Password"
  };

  const validation = new Validator(data, rules);
  validation.setAttributeNames(attrNames);
  const errors = validation.errors.all();
  const valid = validation.passes();

  return {
    errors,
    isValid: valid
  };
};
