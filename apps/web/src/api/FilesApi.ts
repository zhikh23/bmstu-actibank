import { httpClient } from './http';

export interface UploadFileResponseContract {
  fileId: string;
}

export class FilesApi {
  constructor(private http = httpClient) {}

  async upload(file: File): Promise<UploadFileResponseContract> {
    const body = new FormData();
    body.append('file', file);
    const response = await this.http.post<UploadFileResponseContract>(
      '/api/v1/files',
      body,
    );
    return response.data;
  }
}
