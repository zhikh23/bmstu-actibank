import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModel, UserRoleModel } from './user.model';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, UserRoleModel])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
