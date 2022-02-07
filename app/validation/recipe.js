import Joi from "joi";

export const recipeValidationSchema = Joi.object()
  .keys({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(15).max(250).required(),
    ingredients: Joi.array()
      .min(1)
      .items({
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

export async function validateRequest(recipe) {
  try {
    const value = await recipeValidationSchema.validateAsync(recipe);
    return { value: value, error: null };
  } catch (error) {
    return { error: error, value: null };
  }
}
