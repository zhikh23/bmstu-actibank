export enum UserRole {
  Applicant = 'applicant',
  Moderator = 'moderator',
}

export class AuthenticatedUser {
  constructor(
    public readonly id: string,
    public readonly subject: string,
    public readonly roles: UserRole[],
  ) {}
}
