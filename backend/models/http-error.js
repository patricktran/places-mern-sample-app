class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    // add a code property
    this.code = errorCode;
  }
}

module.exports = HttpError;
