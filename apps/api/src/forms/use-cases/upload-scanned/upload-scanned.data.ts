export type UploadScannedCommand = {
  formId: string;
  actorId: string;
  body: Buffer;
  filename: string;
  contentType: string;
};

export type UploadScannedResult = {
  documentId: string;
};
