import { StudentEntity } from '@/students/domain/student.entity';

import { StudentModel } from './student.model';

export class StudentMapper {
  static toDomain(p: StudentModel): StudentEntity {
    return new StudentEntity(
      p.id,
      p.first_name,
      p.last_name,
      p.middle_name ? p.middle_name : undefined,
    );
  }
}
