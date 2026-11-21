import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { OrganizationRepository } from '@/catalog/infra/repository/organization/organization.repository';

import { OrganizationWithCategoryType } from './get-organizations.data';

export type GetOrganizationsQuery = {
  ids: string[];
};

@Injectable()
export class GetOrganizationsHandler {
  constructor(private readonly repository: OrganizationRepository) {}

  execute(
    q: GetOrganizationsQuery,
  ): ResultAsync<OrganizationWithCategoryType[], CatalogError> {
    return ResultAsync.combine(
      q.ids.map((id) => this.repository.getWithCategories(id)),
    );
  }
}
