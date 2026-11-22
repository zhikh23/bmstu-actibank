import { Module } from '@nestjs/common';

import { FormatRepositoryModule } from '@/catalog/infra/repository/format/format.module';

import { GetAllFormatsHandler } from './get-all-formats.handler';

@Module({
  imports: [FormatRepositoryModule],
  providers: [GetAllFormatsHandler],
  exports: [GetAllFormatsHandler],
})
export class GetAllFormatsModule {}
