import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type UploadFileCommand = {
  actor: AuthenticatedUser;
  filename: string;
  contentType: string;
  body: Buffer;
};

export type UploadFileResult = {
  fileId: string;
};
