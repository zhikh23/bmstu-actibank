import { Module } from '@nestjs/common';
import { UuidModule } from '../../../shared/infra/uuid/uuid.module';
import { UploadScannedHandler } from './upload-scanned.handler';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { StorageModule } from '../../infra/storage/storage.module';

@Module({
  imports: [FormRepositoryModule, UuidModule, StorageModule],
  providers: [UploadScannedHandler],
  exports: [UploadScannedHandler],
})
export class UploadScannedModule {}
