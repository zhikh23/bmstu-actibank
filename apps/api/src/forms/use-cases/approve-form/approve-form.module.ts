import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { ApproveFormHandler } from './approve-form.handler';
import { EventsServiceModule } from '@/events/external/events-service.module';

@Module({
  imports: [FormRepositoryModule, EventsServiceModule],
  providers: [ApproveFormHandler],
  exports: [ApproveFormHandler],
})
export class ApproveFormModule {}
