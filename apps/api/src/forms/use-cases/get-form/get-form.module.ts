import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { GetFormHandler } from './get-form.handler';
import { VenueProviderModule } from '../../../catalog/external/venue-provider/venue-provider.module';
import { ThemeProviderModule } from '../../../catalog/external/theme-provider/theme-provider.module';
import { EventTypeProviderModule } from '../../../catalog/external/event-type-provider/event-type.module';
import { FormatProviderModule } from '../../../catalog/external/format-provider/format-provider.module';
import { LevelProviderModule } from '../../../catalog/external/level-provider/level-provider.module';

@Module({
  imports: [
    FormRepositoryModule,
    EventTypeProviderModule,
    FormatProviderModule,
    LevelProviderModule,
    VenueProviderModule,
    ThemeProviderModule,
  ],
  providers: [GetFormHandler],
  exports: [GetFormHandler],
})
export class GetFormModule {}
