import { Recipe } from "../model/recipe";

export const DEFAULT_LIMIT = 5;
export const DEFAULT_OFFSET = 0;

export async function getPagingParams(query) {
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

export function transformQuery(query, keys) {
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

export function toPage(collection, collectionCount, limit, offset) {
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
