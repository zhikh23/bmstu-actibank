import { Module } from '@nestjs/common';
import { UserLoginHandler } from './user-login.handler';
import { OidcModule } from '../../infrastructure/oidc/oidc.module';

@Module({
  imports: [OidcModule],
  providers: [UserLoginHandler],
  exports: [UserLoginHandler],
})
export class UserLoginModule {}
