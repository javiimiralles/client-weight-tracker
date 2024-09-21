export class WeightRecord {
  constructor(
    public _id: string,
    public date?: Date,
    public weight?: number,
    public user?: string
  ) {}
}
