import { MeContract } from '@/adapters/auth.adapter';

import { httpClient } from './http';

export class AuthApi {
  constructor(private http = httpClient) {}

  async getMe(): Promise<MeContract> {
    const response = await this.http.get<MeContract>('/api/v1/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.http.get<void>('/api/v1/auth/logout');
  }
}
