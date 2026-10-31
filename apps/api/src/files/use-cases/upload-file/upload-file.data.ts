export type UploadFileCommand = {
  actorId: string;
  filename: string;
  contentType: string;
  body: Buffer;
};

export type UploadFileResult = {
  fileId: string;
};
