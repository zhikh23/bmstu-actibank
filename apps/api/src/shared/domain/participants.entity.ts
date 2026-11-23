export class Participants {
  constructor(
    public students: number,
    public employees: number,
    public others: number,
  ) {}

  total(): number {
    return this.students + this.employees + this.others;
  }
}
