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
  themes: string[];
  start: Date;
  end: Date;
  formatId: string;
  typeId: string;
  levelId: string;
  participants: ParticipantsType;
  guests: GuestType[];
  team: MemberType[];
  status: string;
  reason: string | null;
  submitterId: string;
  reviewerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  canceledAt: Date | null;
};
