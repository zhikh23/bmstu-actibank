import {CreateFormRequestContract, CreateFormResponseContract, FormsListItemContract} from '@/adapters/forms.adapter'
import {httpClient} from './http'

export class FormsApi {
  constructor(private http = httpClient) { }

  async getFormsList(): Promise<FormsListItemContract[]> {
    const response = await this.http.get<FormsListItemContract[]>('/api/v1/forms')
    return response.data
  }

  async createForm(request: CreateFormRequestContract): Promise<CreateFormResponseContract> {
    const response = await this.http.post<CreateFormResponseContract>('/api/v1/forms', request)
    return response.data
  }
}
