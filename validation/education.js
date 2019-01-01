const Validator = require("validatorjs");

module.exports = data => {
  const rules = {
    school: "required|string",
    degree: "required|string",
    fieldofstudy: "required|string",
    from: "required|date",
    to: "required_without:current|date|after:from",
    current: "boolean",
    description: "string"
  };

  const validation = new Validator(data, rules);
  const errors = validation.errors.all();
  const valid = validation.passes();

  return {
    errors,
    isValid: valid
  };
};
