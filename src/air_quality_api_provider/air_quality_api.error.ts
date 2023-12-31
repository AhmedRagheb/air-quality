export class AirQualityApiException extends Error {
  private _status: number;

  public get status() {
    return this._status;
  }

  constructor(status: number) {
    super();
    this._status = status;
    Object.setPrototypeOf(this, AirQualityApiException.prototype);
  }
}
