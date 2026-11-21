import { Module } from '@nestjs/common';

import { OidcModule } from '@/auth/infrastructure/oidc/oidc.module';
import { UserRepositoryModule } from '@/auth/infrastructure/repositories/user.module';
import { UuidModule } from '@/shared/infra/uuid/uuid.module';

import { AuthCallbackHandler } from './auth-callback.handler';

@Module({
  imports: [OidcModule, UserRepositoryModule, UuidModule],
  providers: [AuthCallbackHandler],
  exports: [AuthCallbackHandler],
})
export class AuthCallbackModule {}
