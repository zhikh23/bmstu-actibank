export class Role {
  constructor(
    public id: string,
    public categoryId: string,
    public priority: number,
    public name: string,
  ) {}
}
