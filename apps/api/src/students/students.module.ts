import { Module } from '@nestjs/common';

import { StudentsController } from './presentation/students.controller';
import { StudentsService } from './presentation/students.service';
import { GetStudentModule } from './use-cases/get-student/get-student.module';
import { ListStudentsModule } from './use-cases/list-students/list-students.module';

@Module({
  imports: [GetStudentModule, ListStudentsModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
