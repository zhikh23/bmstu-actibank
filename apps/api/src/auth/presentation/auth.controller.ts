import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import { AuthRequest, AuthResponse } from './http.types';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';

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
  login(
    @Query('returnTo') returnTo: string | undefined,
    @Res() response: AuthResponse,
  ): Promise<void> {
    return this.auth.login(response, returnTo);
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

  @Get('me')
  @ApiCookieAuth('actibank_session')
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiOkResponse({
    description: 'Информация о пользователе',
    type: AuthenticatedUserDto,
  })
  @ApiOkResponse({ description: 'Пользователь не авторизован' })
  me(@Req() request: AuthRequest): Promise<AuthenticatedUserDto> {
    return this.auth.getMe(request);
  }
}
