import { Module } from '@nestjs/common';

import { StudentRepositoryModule } from '@/students/infra/repositories/student.module';

import { ListStudentsHandler } from './list-students.handler';

@Module({
  imports: [StudentRepositoryModule],
  providers: [ListStudentsHandler],
  exports: [ListStudentsHandler],
})
export class ListStudentsModule {}
