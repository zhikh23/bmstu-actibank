import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { GetFormHandler } from './get-form.handler';
import { VenueProviderModule } from '../../../events/external/venue-provider/venue-provider.module';

@Module({
  imports: [FormRepositoryModule, VenueProviderModule],
  providers: [GetFormHandler],
  exports: [GetFormHandler],
})
export class GetFormModule {}
