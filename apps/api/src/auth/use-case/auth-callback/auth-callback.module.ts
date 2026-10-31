import { Module } from '@nestjs/common';
import { AuthCallbackHandler } from './auth-callback.handler';
import { UserRepositoryModule } from '../../infrastructure/repositories/user.module';
import { OidcModule } from '../../infrastructure/oidc/oidc.module';
import { UuidModule } from '../../../shared/infra/uuid/uuid.module';

@Module({
  imports: [OidcModule, UserRepositoryModule, UuidModule],
  providers: [AuthCallbackHandler],
  exports: [AuthCallbackHandler],
})
export class AuthCallbackModule {}
