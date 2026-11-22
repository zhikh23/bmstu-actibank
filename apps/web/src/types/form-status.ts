export type FormStatus =
  'draft' | 'pending' | 'approved' | 'reviewing' | 'canceled' | 'rejected';

export const FormStatus = {
  all: () => {
    return [
      'draft',
      'pending',
      'approved',
      'reviewing',
      'canceled',
      'rejected',
    ];
  },
};
