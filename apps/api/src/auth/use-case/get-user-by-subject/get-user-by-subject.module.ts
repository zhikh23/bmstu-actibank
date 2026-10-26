import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../../infrastructure/repositories/user.module';
import { GetUserBySubjectHandler } from './get-user-by-subject.handler';

@Module({
  imports: [UserRepositoryModule],
  providers: [GetUserBySubjectHandler],
  exports: [GetUserBySubjectHandler],
})
export class GetUserBySubjectModule {}
