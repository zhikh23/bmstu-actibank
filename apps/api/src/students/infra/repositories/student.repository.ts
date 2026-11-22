import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Repository } from 'typeorm';

import { StudentsError } from '@/students/domain/errors';
import { StudentEntity } from '@/students/domain/student.entity';

import { StudentMapper } from './student.mapper';
import { StudentModel } from './student.model';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(StudentModel)
    private readonly repository: Repository<StudentModel>,
  ) {}

  get(id: string): ResultAsync<StudentEntity, StudentsError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
      }),
      (error) =>
        StudentsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? okAsync(StudentMapper.toDomain(model))
        : errAsync(StudentsError.notFound(`student with id "${id} not found"`)),
    );
  }

  getAll(): ResultAsync<StudentEntity[], StudentsError> {
    return ResultAsync.fromPromise(this.repository.find(), (error) =>
      StudentsError.repository(
        error instanceof Error ? error.message : String(error),
      ),
    ).map((models) => models.map(StudentMapper.toDomain));
  }
}
