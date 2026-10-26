import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { AuthError } from '../../domain/errors';
import { AuthenticatedUser } from '../../domain/user.entity';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class GetUserBySubjectHandler {
  constructor(private readonly userRepository: UserRepository) {}

  run(subject: string): ResultAsync<AuthenticatedUser | null, AuthError> {
    return this.userRepository.getOrNull(subject);
  }
}
