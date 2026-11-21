import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { StudentsError } from '@/students/domain/errors';
import { StudentRepository } from '@/students/infra/repositories/student.repository';

import { StudentType } from './get-student.data';

export type GetStudentQuery = {
  studentId: string;
};

@Injectable()
export class GetStudentHandler {
  constructor(private readonly repository: StudentRepository) {}

  execute(q: GetStudentQuery): ResultAsync<StudentType, StudentsError> {
    return this.repository.get(q.studentId).map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName,
      fullName: student.fullName,
    }));
  }
}
