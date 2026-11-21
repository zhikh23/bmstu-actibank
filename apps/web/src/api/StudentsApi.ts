import {httpClient} from "@/api/http";
import {StudentContract, StudentsListItemContract} from "@/adapters/students.adapter";

export class StudentsApi {
  constructor(private http = httpClient) { }

  async getStudent(studentId: string): Promise<StudentContract> {
    const response = await this.http.get<StudentContract>(`/api/v1/students/${studentId}`)
    return response.data
  }

  async getStudentsList(): Promise<StudentsListItemContract[]> {
    const response = await this.http.get<StudentsListItemContract[]>('/api/v1/students')
    return response.data
  }
}
