const Recipe = require("../../models/recipe");

const { queryByText, queryByProperties } = require("../query/query");
const { isNullOrEmpty } = require("../../utils/stringUtils");
const { getPagingParams, toPage } = require("../paging/paging");
const { NotFoundException } = require("../../utils/errorUtils");

async function get(id) {
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

async function search(query) {
  try {
    if (query.hasOwnProperty("text")) {
      if (isNullOrEmpty(query.text)) {
        return await getAll(query);
      }
      return await queryByText(query);
    } else {
      return await queryByProperties(query);
    }
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

async function getAll(query) {
  try {
    const { text, ...dbQuery } = query;
    const { limit, offset, skip } = getPagingParams(dbQuery);

    const recipeCollection = await Recipe.find().skip(skip).limit(limit);
    const collectionSize = await Recipe.count();

    return toPage(recipeCollection, collectionSize, limit, offset);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

async function update(id, recipeData) {
  try {
    const recipe = await get(id);
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

async function patch(id, recipeData) {
  try {
    const recipe = await get(id);
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

async function remove(id) {
  try {
    const recipe = await get(id);
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

module.exports = {
  get,
  getAll,
  search,
  update,
  patch,
  save,
  remove,
};
