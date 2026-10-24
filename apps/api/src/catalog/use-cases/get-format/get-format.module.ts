import { Module } from '@nestjs/common';
import { GetFormatHandler } from './get-format.handler';
import { FormatRepositoryModule } from '../../infra/repository/format/format.module';

@Module({
  imports: [FormatRepositoryModule],
  providers: [GetFormatHandler],
  exports: [GetFormatHandler],
})
export class GetFormatModule {}
