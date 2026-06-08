export class JwtUserPayLoad implements Express.User {
    private _email: string;

    constructor(email: string) {
        this._email = email;
    }

    get email(): string {
        return this._email
    }
}