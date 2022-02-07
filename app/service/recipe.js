import { Recipe } from "../model/recipe";
import { DEFAULT_LIMIT, DEFAULT_OFFSET, getPagingParams, toPage, transformQuery } from "../util/queryUtil";
import { isNullOrEmpty } from "../util/stringUtil";

export async function find(id) {
  try {
    return await Recipe.findById(id);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

export async function save(recipe) {

  const {ingredients} = recipe;
  
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

export async function findAll(query) {
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

async function queryByText(query, searchText) {
  const offset =
    parseInt(query.offset) > 0 ? parseInt(query.offset) : DEFAULT_OFFSET;
  const limit =
    parseInt(query.limit) > 0 ? parseInt(query.limit) : DEFAULT_LIMIT;
  const skip = offset * limit;

  const recipeCollection = await Recipe.find(searchText)
    .skip(skip)
    .limit(limit);

  return toPage(recipeCollection, recipeCollection.length, limit, offset);
}

async function queryData(query) {
  const { limit, offset, skip } = await getPagingParams(query);
  const dbQuery = transformQuery(query, ["name", "ingredient"]);

  dbQuery["limit"] = limit;
  dbQuery["offset"] = offset;

  if (!Object.keys(dbQuery).length) {
    return toPage([], 0, DEFAULT_LIMIT, DEFAULT_OFFSET);
  }

  const recipeCollection = await Recipe.find(dbQuery).skip(skip).limit(limit);

  if (recipeCollection.length == 0) {
    return toPage([], 0, DEFAULT_LIMIT, DEFAULT_OFFSET);
  } else if (
    !isNullOrEmpty(dbQuery.name) ||
    !isNullOrEmpty(dbQuery.ingredient)
  ) {
    return toPage(recipeCollection, recipeCollection.length, limit, offset);
  }
  return toPage(recipeCollection, await Recipe.count(), limit, offset);
}
