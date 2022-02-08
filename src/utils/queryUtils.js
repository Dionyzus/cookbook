const Recipe = require("../models/recipe");
const { isNullOrEmpty } = require("./stringUtils");

const DEFAULT_LIMIT = 5;
const DEFAULT_OFFSET = 0;

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

async function getPagingParams(query) {
  let offset =
    parseInt(query.offset) > 0 ? parseInt(query.offset) : DEFAULT_OFFSET;
  const limit =
    parseInt(query.limit) > 0 ? parseInt(query.limit) : DEFAULT_LIMIT;

  const collectionCount = await Recipe.count();
  const pagesCount = Math.ceil(collectionCount / limit);

  if (offset >= pagesCount) {
    offset = pagesCount - 1;
  }
  const skip = Math.abs(offset * limit);

  return { limit, offset, skip };
}

function transformQuery(query, keys) {
  const dbQuery = {};
  Object.keys(query).forEach((key) => {
    if (keys.includes(key)) {
      query[key] = { $regex: query[key], $options: "i" };
      if (key === "ingredient") {
        dbQuery["ingredients.ingredient"] = query[key];
      } else {
        dbQuery[key] = query[key];
      }
      delete query[key];
    }
  });
  return dbQuery;
}

function toPage(collection, collectionCount, limit, offset) {
  const totalPages = Math.ceil(collectionCount / limit);
  const pages = [...Array(totalPages).keys()];

  const pageResult = {
    collection,
    pager: {
      collectionSize: collectionCount,
      currentPage: offset + 1,
      pagesCount: totalPages,
      pages: pages,
    },
  };
  return pageResult;
}

module.exports = {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  getPagingParams,
  transformQuery,
  toPage,
  queryByText,
  queryData,
};
