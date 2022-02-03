import { Recipe } from "../model/recipe";

export async function save(recipe) {
  const newRecipe = new Recipe({
    name: recipe.name,
    ingredients: recipe.ingredients,
    description: recipe.description,
  });

  try {
    return await newRecipe.save(newRecipe);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

export async function findAll(query) {
  try {
    //Looking for data containing text, how about this?
    if (query.text != null) {
      return await Recipe.find({
        $text: { $search: query.text },
      });
      //Otherwise normal query
    }
    return await Recipe.find(query);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

export async function find(id) {
  try {
    return await Recipe.findById(id);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}
