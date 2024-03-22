const Joi = require("joi");

const tokenSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
});

module.exports = tokenSchema;

