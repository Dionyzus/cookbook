const Recipe = require("../models/recipe");
const NotFoundException = require("../utils/errorUtils");
const { DEFAULT_LIMIT, DEFAULT_OFFSET, toPage, queryByText, queryData } = require("../utils/queryUtils");
const { isNullOrEmpty } = require("../utils/stringUtils");

async function find(id) {
  try {
    const recipe = await Recipe.findById(id);
    if (recipe != null) {
      return recipe;
    } else {
      throw new NotFoundException(`Recipe with id: ${id} does not exist`);
    }
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

async function remove(id) {
  try {
    const recipe = await find(id);
    if (recipe != null) {
      return await Recipe.deleteOne({ _id: id });
    } else {
      throw new NotFoundException(`Recipe with id: ${id} does not exist`);
    }
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

async function update(id, recipeData) {
  try {
    const recipe = await find(id);
    if (recipe != null) {
      await Recipe.updateOne({ _id: id }, recipeData);
      return recipeData;
    } else {
      throw new NotFoundException(`Recipe with id: ${id} does not exist`);
    }
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

async function save(recipe) {
  const { ingredients } = recipe;

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

async function findAll(query) {
  try {
    if (
      isNullOrEmpty(query.offset) &&
      isNullOrEmpty(query.name) &&
      isNullOrEmpty(query.ingredient) &&
      isNullOrEmpty(query.text)
    ) {
      const recipeCollection = await Recipe.find()
        .skip(DEFAULT_OFFSET)
        .limit(DEFAULT_LIMIT);
      return toPage(
        recipeCollection,
        await Recipe.count(),
        DEFAULT_LIMIT,
        DEFAULT_OFFSET
      );
    } else if (!isNullOrEmpty(query.text)) {
      const searchText = {
        $text: { $search: query.text },
      };
      return await queryByText(query, searchText);
    } else {
      return await queryData(query);
    }
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

module.exports = {
  find,
  findAll,
  update,
  save,
  remove,
};
