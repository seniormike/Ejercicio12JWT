const joi = require("joi");
const schema = joi.object({
  message: joi.string().min(5).required(),
  author: joi.string().required(),
  ts: joi.number()
});
exports.messageValidation = schema;