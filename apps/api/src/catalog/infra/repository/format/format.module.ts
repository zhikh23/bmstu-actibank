import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormatModel } from './format.model';
import { FormatRepository } from './format.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FormatModel])],
  providers: [FormatRepository],
  exports: [FormatRepository],
})
export class FormatRepositoryModule {}
