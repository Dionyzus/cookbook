const Joi = require("joi");

const validationSchema = Joi.object()
  .keys({
    _id: Joi.string(),
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(15).max(250).required(),
    ingredients: Joi.array()
      .min(1)
      .items({
        _id: Joi.string(),
        ingredient: Joi.string().min(3).max(30).required(),
        amount: Joi.object()
          .keys({
            value: Joi.number().required(),
            unit: Joi.string().valid("g", "kg", "ml", "l").required(),
          })
          .required(),
      })
      .required(),
  })
  .required();

const patchValidationSchema = Joi.object().keys({
  _id: Joi.string(),
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(15).max(250),
  ingredients: Joi.array()
    .min(1)
    .items({
      _id: Joi.string(),
      ingredient: Joi.string().min(3).max(30),
      amount: Joi.object().keys({
        value: Joi.number(),
        unit: Joi.string().valid("g", "kg", "ml", "l"),
      }),
    }),
});

exports.validateRequest = async (recipe, method) => {
  try {
    let value;
    if (method === "PATCH") {
      value = await patchValidationSchema.validateAsync(recipe);
    } else {
      value = await validationSchema.validateAsync(recipe);
    }

    return { value: value, error: null };
  } catch (error) {
    return { error: error, value: null };
  }
};
