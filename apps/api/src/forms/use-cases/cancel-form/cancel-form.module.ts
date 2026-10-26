import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { CancelFormHandler } from './cancel-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [CancelFormHandler],
  exports: [CancelFormHandler],
})
export class CancelFormModule {}
