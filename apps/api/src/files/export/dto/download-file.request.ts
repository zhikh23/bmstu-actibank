import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export type DownloadFileRequest = {
  actor: AuthenticatedUser;
  fileId: string;
};
