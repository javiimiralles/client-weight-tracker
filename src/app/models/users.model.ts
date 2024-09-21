export class User {
  constructor(
    public _id: string,
    public username?: string,
    public password?: string,
    public gender?: string,
    public height?: number,
    public age?: number,
    public targetWeight?: number
  ) {}
}
