import { Module } from '@nestjs/common';

import { StudentRepositoryModule } from '@/students/infra/repositories/student.module';

import { GetStudentHandler } from './get-student.handler';

@Module({
  imports: [StudentRepositoryModule],
  providers: [GetStudentHandler],
  exports: [GetStudentHandler],
})
export class GetStudentModule {}
