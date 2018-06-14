export default class APIError extends Error {
  constructor(errorText, status, response, result) {
    super(errorText);
    this.name = this.constructor.name;
    this.status = status;
    this.response = response;
    this.result = result;
    // Error.captureStackTrace(this, this.constructor);
  }
}
