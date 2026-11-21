import { Module } from '@nestjs/common';

import { FormatRepositoryModule } from '@/catalog/infra/repository/format/format.module';

import { GetFormatHandler } from './get-format.handler';

@Module({
  imports: [FormatRepositoryModule],
  providers: [GetFormatHandler],
  exports: [GetFormatHandler],
})
export class GetFormatModule {}
