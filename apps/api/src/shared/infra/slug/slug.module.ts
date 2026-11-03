import { Module } from '@nestjs/common';
import { SLUG_PORT } from './slug.tokens';
import { SlugService } from './slug.service';

@Module({
  providers: [
    {
      provide: SLUG_PORT,
      useClass: SlugService,
    },
  ],
  exports: [SLUG_PORT],
})
export class SlugModule {}
