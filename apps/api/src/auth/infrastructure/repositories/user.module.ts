import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserModel, UserRoleModel } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, UserRoleModel])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
