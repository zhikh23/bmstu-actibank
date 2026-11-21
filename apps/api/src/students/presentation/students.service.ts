import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { StudentsError } from '@/students/domain/errors';
import { GetStudentHandler } from '@/students/use-cases/get-student/get-student.handler';
import { ListStudentsHandler } from '@/students/use-cases/list-students/list-students.handler';

import { ListStudentsResponse } from './dto/list-students.response';
import { StudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    private readonly getStudent: GetStudentHandler,
    private readonly listStudents: ListStudentsHandler,
  ) {}

  async get(studentId: string): Promise<StudentDto> {
    return this.resolve(this.getStudent.execute({ studentId }));
  }

  async list(): Promise<ListStudentsResponse> {
    return this.resolve(this.listStudents.execute());
  }

  private resolve<T>(result: ResultAsync<T, StudentsError>): Promise<T> {
    return result.match(
      (value) => value,
      (error) => {
        if (error.kind === 'NotFound')
          throw new NotFoundException(error.message);
        this.logger.error(error);
        throw new InternalServerErrorException();
      },
    );
  }
}
