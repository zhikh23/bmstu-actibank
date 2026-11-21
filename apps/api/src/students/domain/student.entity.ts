export class StudentEntity {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public middleName?: string,
  ) {}

  get fullName(): string {
    return [this.lastName, this.firstName, this.middleName]
      .filter(Boolean)
      .join(' ');
  }
}
