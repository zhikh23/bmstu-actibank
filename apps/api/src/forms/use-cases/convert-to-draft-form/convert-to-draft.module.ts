import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { ConvertToDraftFormHandler } from './convert-to-draft-form-handler.service';

@Module({
  imports: [FormRepositoryModule],
  providers: [ConvertToDraftFormHandler],
  exports: [ConvertToDraftFormHandler],
})
export class ConvertToDraftModule {}
