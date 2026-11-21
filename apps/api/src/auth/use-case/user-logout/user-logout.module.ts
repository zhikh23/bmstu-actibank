import { Module } from '@nestjs/common';

import { UserLogoutHandler } from './user-logout.handler';

@Module({
  exports: [UserLogoutHandler],
  providers: [UserLogoutHandler],
})
export class UserLogoutModule {}
