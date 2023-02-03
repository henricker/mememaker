const Joi = require('@hapi/joi');

exports.mememakerQueryParametersValidator = Joi.object({
      image: Joi.string().uri().required(),
      topText: Joi.string().max(200).required(),
      bottomText: Joi.string().max(200)
})