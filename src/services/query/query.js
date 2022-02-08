const Recipe = require("../../models/recipe");
const { BadRequestException } = require("../../utils/errorUtils");
const {
  getPagingParams,
  toPage,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} = require("../paging/paging");

async function queryByText(query) {
  const searchText = {
    $text: { $search: query.text },
  };

  const { limit, offset, skip } = getPagingParams(query);

  const recipeCollection = await Recipe.find(searchText)
    .skip(skip)
    .limit(limit);

  return toPage(recipeCollection, recipeCollection.length, limit, offset);
}

async function queryByProperties(query) {
  const { limit, offset, skip } = getPagingParams(query);

  const dbQuery = createQueryFilter(query);

  if (!Object.keys(dbQuery).length) {
    return toPage([], 0, DEFAULT_LIMIT, DEFAULT_OFFSET);
  }

  dbQuery["limit"] = limit;
  dbQuery["offset"] = offset;

  const recipeCollection = await Recipe.find(dbQuery).skip(skip).limit(limit);

  if (recipeCollection.length == 0) {
    return toPage([], 0, DEFAULT_LIMIT, DEFAULT_OFFSET);
  }
  return toPage(recipeCollection, recipeCollection.length, limit, offset);
}

function createQueryFilter(query) {
  const dbQuery = {};

  const queryKeys = Object.keys(query);
  const queryFields = ["name", "ingredient", "limit", "offset"];

  queryKeys.forEach((key) => {
    if (!queryFields.includes(key)) {
      throw new BadRequestException("invalid search key: " + key);
    }
    query[key] = { $regex: query[key], $options: "i" };
    if (key === "ingredient") {
      dbQuery["ingredients.ingredient"] = query[key];
    } else {
      dbQuery[key] = query[key];
    }

    delete query[key];
  });

  return dbQuery;
}

module.exports = {
  queryByText,
  queryByProperties,
};
