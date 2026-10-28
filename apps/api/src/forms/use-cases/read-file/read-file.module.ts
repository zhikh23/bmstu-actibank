import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { StorageModule } from '../../infra/storage/storage.module';
import { ReadFileHandler } from './read-file.handler';

@Module({
  imports: [FormRepositoryModule, StorageModule],
  providers: [ReadFileHandler],
  exports: [ReadFileHandler],
})
export class ReadFileModule {}
