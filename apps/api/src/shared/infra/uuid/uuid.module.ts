import { Module } from '@nestjs/common';

import { UUID_PORT } from './uuid.port';
import { UuidService } from './uuid.service';

@Module({
  providers: [UuidService, { provide: UUID_PORT, useExisting: UuidService }],
  exports: [UUID_PORT],
})
export class UuidModule {}
