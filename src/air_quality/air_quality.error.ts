export class InvalidModelException extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, InvalidModelException.prototype);
  }
}
