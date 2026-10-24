import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { GetFormHandler } from './get-form.handler';
import { VenueProviderModule } from '../../../events/external/venue-provider/venue-provider.module';
import { ThemeProviderModule } from '../../../events/external/theme-provider/theme-provider.module';

@Module({
  imports: [FormRepositoryModule, VenueProviderModule, ThemeProviderModule],
  providers: [GetFormHandler],
  exports: [GetFormHandler],
})
export class GetFormModule {}
