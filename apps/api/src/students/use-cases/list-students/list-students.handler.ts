import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../../infra/repositories/student.repository';
import { ResultAsync } from 'neverthrow';
import { StudentsError } from '../../domain/errors';
import { StudentsListItem } from './list-students.data';

@Injectable()
export class ListStudentsHandler {
  constructor(private readonly repository: StudentRepository) {}

  execute(): ResultAsync<StudentsListItem[], StudentsError> {
    return this.repository.getAll().map((students) =>
      students.map((student) => ({
        id: student.id,
        fullName: student.fullName,
      })),
    );
  }
}
