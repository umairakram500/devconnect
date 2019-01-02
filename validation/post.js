const Validator = require("validatorjs");

module.exports = data => {
  const rules = {
    text: "required|string|min:10|max:30",
    name: "string",
    avatar: "string"
  };

  const validation = new Validator(data, rules);
  const errors = validation.errors.all();
  const valid = validation.passes();

  return {
    errors,
    isValid: valid
  };
};
