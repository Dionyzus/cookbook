export function transformQuery(query, keys) {
  const dbQuery = {};
  Object.keys(query).forEach((key) => {
    if (keys.includes(key)) {
      query[key] = { $regex: query[key], $options: "i" };
      dbQuery[key] = query[key];
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
