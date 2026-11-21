import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from '@/auth/presentation/auth.controller';
import {
  AuthenticationGuard,
  RolesGuard,
} from '@/auth/presentation/auth.guards';
import { AuthService } from '@/auth/presentation/auth.service';

import { OidcAdapter } from './infrastructure/oidc/oidc.adapter';
import { AuthCallbackModule } from './use-case/auth-callback/auth-callback.module';
import { GetSessionUserModule } from './use-case/get-session-user/get-session-user.module';
import { UserLoginModule } from './use-case/user-login/user-login.module';
import { UserLogoutModule } from './use-case/user-logout/user-logout.module';

@Module({
  imports: [
    AuthCallbackModule,
    GetSessionUserModule,
    UserLoginModule,
    UserLogoutModule,
  ],
  controllers: [AuthController],
  providers: [
    OidcAdapter,
    AuthService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
