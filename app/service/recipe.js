import { Recipe } from "../model/recipe";

export async function findAll(query) {
  try {
    //Looking for data containing text, how about this?
    if (query.text != null) {
      const textSearch = {
        $text: { $search: query.text },
      };
      return await toPage(query, textSearch);
    }
    //Otherwise normal query
    return await toPage(query);
  } catch (error) {
    console.log("An error occurred: " + error);
    throw error;
  }
}

async function toPage(query, textSearch) {
  const offset = parseInt(query.offset) > 0 ? parseInt(query.offset) : 0;
  const limit = parseInt(query.limit) > 0 ? parseInt(query.limit) : 0;

  const skip = offset * limit;

  let recipeCollection;
  if (textSearch != null) {
    recipeCollection = await Recipe.find(textSearch).skip(skip).limit(limit);
  } else {
    recipeCollection = await Recipe.find(query).skip(skip).limit(limit);
  }

  const recipeCollectionCount = await Recipe.count();

  const totalPages = Math.ceil(recipeCollectionCount / limit);

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i);
  }

  const pageResult = {
    recipeCollection,
    pager: {
      collectionSize: recipeCollectionCount,
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
