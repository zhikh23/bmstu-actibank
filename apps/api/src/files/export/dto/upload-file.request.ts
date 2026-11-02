import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type UploadFileRequest = {
  actor: AuthenticatedUser;
  filename: string;
  contentType: string;
  body: Buffer;
};
