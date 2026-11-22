import {
  CreateFormRequestContract,
  CreateFormResponseContract,
  FormDetailContract,
  FormsListItemContract,
  GenerateDocumentResponseContract,
} from '@/adapters/forms.adapter';

import { httpClient } from './http';

export class FormsApi {
  constructor(private http = httpClient) {}

  async getFormsList(): Promise<FormsListItemContract[]> {
    const response =
      await this.http.get<FormsListItemContract[]>('/api/v1/forms');
    return response.data;
  }

  async createForm(
    request: CreateFormRequestContract,
  ): Promise<CreateFormResponseContract> {
    const response = await this.http.post<CreateFormResponseContract>(
      '/api/v1/forms',
      request,
    );
    return response.data;
  }

  async getForm(id: string): Promise<FormDetailContract> {
    const response = await this.http.get<FormDetailContract>(
      `/api/v1/forms/${id}`,
    );
    return response.data;
  }

  async updateForm(
    id: string,
    request: CreateFormRequestContract,
  ): Promise<FormDetailContract> {
    const response = await this.http.patch<FormDetailContract>(
      `/api/v1/forms/${id}`,
      request,
    );
    return response.data;
  }

  async generateDocument(
    id: string,
  ): Promise<GenerateDocumentResponseContract> {
    const response = await this.http.post<GenerateDocumentResponseContract>(
      `/api/v1/forms/${id}/generate`,
    );
    return response.data;
  }

  async attachDocument(id: string, fileId: string): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/attach-document`, { fileId });
  }

  async markReady(id: string): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/mark-ready`);
  }

  async convertToDraft(id: string, reason: string | null): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/convert-to-draft`, { reason });
  }

  async cancel(id: string): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/cancel`);
  }

  async cancelReview(id: string): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/cancel-review`);
  }

  async startReview(id: string): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/start-review`);
  }

  async approve(id: string): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/approve`);
  }

  async reject(id: string, reason: string | null): Promise<void> {
    await this.http.post(`/api/v1/forms/${id}/reject`, { reason });
  }
}
