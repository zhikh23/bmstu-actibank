import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../../infra/repository/organization/organization.repository';
import { Result } from 'neverthrow';
import { OrganizationWithCategoryType } from './get-organization.data';
import { CatalogError } from '../../domain/errors';

export type GetOrganizationQuery = {
  id: string;
};

@Injectable()
export class GetOrganizationHandler {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(
    q: GetOrganizationQuery,
  ): Promise<Result<OrganizationWithCategoryType, CatalogError>> {
    return this.repository.getWithCategories(q.id);
  }
}
