import { Module } from '@nestjs/common';
import { UuidService } from './uuid.service';
import { UUID_PORT } from './uuid.port';

@Module({
  providers: [
    UuidService,
    { provide: UUID_PORT, useExisting: UuidService },
  ],
  exports: [UUID_PORT],
})
export class UuidModule {}
