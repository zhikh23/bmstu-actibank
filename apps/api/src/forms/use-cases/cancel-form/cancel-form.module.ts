import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { CancelFormHandler } from './cancel-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [CancelFormHandler],
  exports: [CancelFormHandler],
})
export class CancelFormModule {}
