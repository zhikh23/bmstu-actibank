import { GuestType } from '../../../shared/types/guest.type';
import { MemberType } from '../../../shared/types/member.type';
import { ParticipantsType } from '../../../shared/types/participants.type';

export type FormType = {
  id: string;
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: {
    id: string;
    name: string;
    building: {
      id: string;
      name: string;
    };
  }[];
  themes: {
    id: string;
    title: string;
  }[];
  start: Date;
  end: Date;
  format: {
    id: string;
    label: string;
  };
  type: {
    id: string;
    label: string;
  };
  level: {
    id: string;
    label: string;
  };
  participants: ParticipantsType;
  guests: {
    userId: string;
    rankId: string;
  }[];
  team: {
    userId: string;
    role: {
      id: string;
      label: string;
      category: {
        id: string;
        label: string;
      };
    };
  }[];
  status: string;
  reason: string | null;
  submitterId: string;
  reviewerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  canceledAt: Date | null;
};
