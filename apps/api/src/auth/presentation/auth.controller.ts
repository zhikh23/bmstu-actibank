import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import { AuthRequest, AuthResponse } from './http.types';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('login')
  @Public()
  @ApiOperation({
    summary: 'Начать OIDC-аутентификацию',
    description:
      'Перенаправляет пользователя в OIDC-провайдер. После callback сервер устанавливает session cookie.',
  })
  login(@Res() response: AuthResponse): Promise<void> {
    return this.auth.login(response);
  }

  @Get('callback')
  @Public()
  @ApiOperation({
    summary: 'OIDC callback',
    description:
      'Завершает Authorization Code Flow и устанавливает серверную сессию.',
  })
  callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() response: AuthResponse,
  ): Promise<void> {
    return this.auth.callback(code, state, response);
  }

  @Get('logout')
  @ApiCookieAuth('actibank_session')
  @ApiOperation({ summary: 'Завершить текущую сессию' })
  @ApiNoContentResponse({ description: 'Сессия завершена.' })
  logout(
    @Req() request: AuthRequest,
    @Res() response: AuthResponse,
  ): Promise<void> {
    return this.auth.logout(request, response);
  }
}
