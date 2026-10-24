import { Module } from '@nestjs/common';
import { FormatProvider } from './format-provider.service';
import { GetFormatModule } from '../../use-cases/get-format/get-format.module';

@Module({
  imports: [GetFormatModule],
  providers: [FormatProvider],
  exports: [FormatProvider],
})
export class FormatProviderModule {}
