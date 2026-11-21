import { Module } from '@nestjs/common';

import { SlugService } from './slug.service';
import { SLUG_PORT } from './slug.tokens';

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
