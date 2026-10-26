export class OrganizationCategory {
  constructor(
    public id: string,
    public parentId: string | null,
    public name: string,
  ) {}
}
