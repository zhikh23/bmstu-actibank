import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentModel } from './student.model';
import { Repository } from 'typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { StudentEntity } from '../../domain/student.entity';
import { StudentsError } from '../../domain/errors';
import { StudentMapper } from './student.mapper';

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
