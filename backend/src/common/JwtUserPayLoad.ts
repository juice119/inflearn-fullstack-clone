export class JwtUserPayLoad implements Express.User {
  private _sub: string;
  private _email: string;

  constructor(sub: string, email: string) {
    this._sub = sub;
    this._email = email;
  }

  get id(): string {
    return this._sub;
  }

  get email(): string {
    return this._email;
  }
}
