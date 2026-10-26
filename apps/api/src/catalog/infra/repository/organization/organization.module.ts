import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OrganizationCategoryModel,
  OrganizationModel,
} from './organization.model';
import { OrganizationRepository } from './organization.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationCategoryModel, OrganizationModel]),
  ],
  providers: [OrganizationRepository],
  exports: [OrganizationRepository],
})
export class OrganizationRepositoryModule {}
