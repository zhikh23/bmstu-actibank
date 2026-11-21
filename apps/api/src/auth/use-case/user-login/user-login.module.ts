import { Module } from '@nestjs/common';

import { OidcModule } from '@/auth/infrastructure/oidc/oidc.module';

import { UserLoginHandler } from './user-login.handler';

@Module({
  imports: [OidcModule],
  providers: [UserLoginHandler],
  exports: [UserLoginHandler],
})
export class UserLoginModule {}
