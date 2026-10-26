import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard, RolesGuard } from './presentation/auth.guards';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './presentation/auth.service';
import { OidcAdapter } from './infrastructure/oidc/oidc.adapter';
import { GetUserBySubjectModule } from './use-case/get-user-by-subject/get-user-by-subject.module';

@Module({
  imports: [GetUserBySubjectModule],
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
