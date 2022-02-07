import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  ingredients: [
    {
      ingredientName: String,
      amount: {
        value: Number,
        unit: String,
      },
    },
  ],
  description: String,
});

export const Recipe = mongoose.model("Recipes", RecipeSchema);
