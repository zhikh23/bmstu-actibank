import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModel } from './student.model';
import { StudentRepository } from './student.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudentModel])],
  providers: [StudentRepository],
  exports: [StudentRepository],
})
export class StudentRepositoryModule {}
