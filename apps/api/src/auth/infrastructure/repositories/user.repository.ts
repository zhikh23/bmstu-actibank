import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, okAsync } from 'neverthrow';
import { Repository } from 'typeorm';

import { AuthError } from '@/auth/domain/errors';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

import { UserMapper } from './user.mapper';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
  ) {}

  getOrNull(subject: string): ResultAsync<AuthenticatedUser | null, AuthError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { subject },
        relations: { roles: true },
      }),
      (error) =>
        AuthError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) => okAsync(model ? UserMapper.toDomain(model) : null));
  }
}
