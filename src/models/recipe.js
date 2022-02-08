const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Ingredient = {
  ingredient: String,
  amount: {
    value: Number,
    unit: String,
  },
};

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [Ingredient],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Recipes", RecipeSchema);
