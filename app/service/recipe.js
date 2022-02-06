import { Recipe } from "../model/recipe";
import { isNullOrEmpty } from "../util/stringUtil";

export async function findAll(query) {
  try {
    if (
      isNullOrEmpty(query.offset) &&
      isNullOrEmpty(query.text) &&
      isNullOrEmpty(query.name)
    ) {
      const recipeCollection = await Recipe.find().skip(0).limit(5);
      return toPage(recipeCollection, await Recipe.count(), 5, 0);
    }
    else if (!isNullOrEmpty(query.text)) {
      const searchText = {
        $text: { $search: query.text },
      };
      const queryResult = await queryByText(query, searchText);
      if (queryResult.pager.collectionSize != 0) {
        return queryResult;
      }
    }
    return await queryData(query);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

async function queryByText(query, searchText) {
  const offset = parseInt(query.offset) > 0 ? parseInt(query.offset) : 0;
  const limit = parseInt(query.limit) > 0 ? parseInt(query.limit) : 5;
  const skip = offset * limit;

  const recipeCollection = await Recipe.find(searchText)
    .skip(skip)
    .limit(limit);
  return toPage(recipeCollection, recipeCollection.length, limit, offset);
}

async function queryData(query) {
  const { text, ...dbQuery } = query;
  const name = dbQuery.name;

  if (!Object.keys(dbQuery).length) {
    return toPage([], 0, 5, 0);
  }

  const offset = parseInt(query.offset) > 0 ? parseInt(query.offset) : 0;
  const limit = parseInt(query.limit) > 0 ? parseInt(query.limit) : 5;
  const skip = offset * limit;

  const recipeCollection = await Recipe.find(dbQuery).skip(skip).limit(limit);

  if (recipeCollection.length == 0) {
    return toPage([], 0, 5, 0);
  } else if (!isNullOrEmpty(name)) {
    return toPage(recipeCollection, recipeCollection.length, limit, offset);
  }
  return toPage(recipeCollection, await Recipe.count(), limit, offset);
}

function toPage(recipeCollection, collectionCount, limit, offset) {
  const totalPages = Math.ceil(collectionCount / limit);
  const pages = [...Array(totalPages).keys()];

  const pageResult = {
    recipeCollection,
    pager: {
      collectionSize: collectionCount,
      currentPage: offset + 1,
      pagesCount: totalPages,
      pages: pages,
    },
  };
  return pageResult;
}

export async function find(id) {
  try {
    return await Recipe.findById(id);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

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

export async function update(id, recipe) {
  try {
    return await Recipe.updateOne({ _id: id }, recipe);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

export async function remove(id) {
  try {
    await Recipe.deleteOne({ _id: id });
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}
