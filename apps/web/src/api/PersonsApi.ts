import {httpClient} from "@/api/http";
import {PersonContract, PersonsListItemContract} from "@/adapters/persons.adapter";

export class PersonsApi {
  constructor(private http = httpClient) { }

  async getPerson(personId: string): Promise<PersonContract> {
    const response = await this.http.get<PersonsListItemContract>(`/api/v1/persons/${personId}`)
    return response.data
  }

  async getPersonsList(): Promise<PersonsListItemContract[]> {
    const response = await this.http.get<PersonsListItemContract[]>('/api/v1/persons')
    return response.data
  }
}
