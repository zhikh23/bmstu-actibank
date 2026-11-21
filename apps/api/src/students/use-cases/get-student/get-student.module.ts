import { Module } from '@nestjs/common';
import { GetStudentHandler } from './get-student.handler';
import { StudentRepositoryModule } from '../../infra/repositories/student.module';

@Module({
  imports: [StudentRepositoryModule],
  providers: [GetStudentHandler],
  exports: [GetStudentHandler],
})
export class GetStudentModule {}
