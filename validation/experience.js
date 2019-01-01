const Validator = require("validatorjs");

module.exports = data => {
  const rules = {
    title: "required|string",
    company: "required|string",
    location: "required|string",
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
