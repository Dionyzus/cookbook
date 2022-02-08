exports.NotFoundException = class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
  }
};

exports.BadRequestException = class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestException";
  }
};

const badRequestErrors = [
  "CastError",
  "BadRequestException",
  "ValidationError",
];
exports.getHttpStatusCode = (err) => {
  if (badRequestErrors.includes(err.name)) {
    return this.HttpStatusCode.BAD_REQUEST;
  } else if (err.name === "NotFoundException") {
    return this.HttpStatusCode.NOT_FOUND;
  }
  return this.HttpStatusCode.INTERNAL_SERVER_ERROR;
};

exports.HttpStatusCode = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  NO_CONTENT: 204,
  CREATED: 201,
};
