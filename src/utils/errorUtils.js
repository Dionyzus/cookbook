exports.NotFoundException = class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
  }
};

exports.getHttpStatusCode = (err) => {
  if (err.name === "CastError") {
    return HttpStatusCode.BAD_REQUEST;
  }
  return HttpStatusCode.NOT_FOUND;
};

exports.HttpStatusCode = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  NO_CONTENT: 204,
  CREATED: 201,
};