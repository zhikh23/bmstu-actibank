import { Module } from '@nestjs/common';
import { ListStudentsHandler } from './list-students.handler';
import { StudentRepositoryModule } from '../../infra/repositories/student.module';

@Module({
  imports: [StudentRepositoryModule],
  providers: [ListStudentsHandler],
  exports: [ListStudentsHandler],
})
export class ListStudentsModule {}
