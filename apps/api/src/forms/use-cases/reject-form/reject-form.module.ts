import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { RejectFormHandler } from './reject-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [RejectFormHandler],
  exports: [RejectFormHandler],
})
export class RejectFormModule {}
