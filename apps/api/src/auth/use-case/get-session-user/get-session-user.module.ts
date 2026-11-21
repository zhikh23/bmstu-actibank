import { Module } from '@nestjs/common';

import { GetSessionUserHandler } from './get-session-user.handler';

@Module({
  providers: [GetSessionUserHandler],
  exports: [GetSessionUserHandler],
})
export class GetSessionUserModule {}
