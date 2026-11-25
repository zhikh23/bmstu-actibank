export enum FormStatus {
  Draft = 'draft',
  Pending = 'pending',
  Canceled = 'canceled',
  Reviewing = 'reviewing',
  Approved = 'approved',
  Rejected = 'rejected',
}

export const mapStatus: Record<string, FormStatus> = {
  draft: FormStatus.Draft,
  pending: FormStatus.Pending,
  canceled: FormStatus.Canceled,
  reviewing: FormStatus.Reviewing,
  approved: FormStatus.Approved,
  rejected: FormStatus.Rejected,
};
