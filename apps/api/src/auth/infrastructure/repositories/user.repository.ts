import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../../domain/user.entity';
import { okAsync, ResultAsync } from 'neverthrow';
import { AuthError } from '../../domain/errors';
import { UserMapper } from './user.mapper';

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
