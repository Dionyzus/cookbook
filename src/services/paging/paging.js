const DEFAULT_LIMIT = 5;
const DEFAULT_OFFSET = 0;

function getPagingParams(query) {
  let offset =
    parseInt(query.offset) > 0 ? parseInt(query.offset) : DEFAULT_OFFSET;
  const limit =
    parseInt(query.limit) > 0 ? parseInt(query.limit) : DEFAULT_LIMIT;

  const skip = Math.abs(offset * limit);
  return { limit, offset, skip };
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
  getPagingParams,
  toPage,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
};
