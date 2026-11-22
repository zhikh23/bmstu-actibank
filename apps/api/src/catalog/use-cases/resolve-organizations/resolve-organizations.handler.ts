import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { OrganizationRepository } from '@/catalog/infra/repository/organization/organization.repository';

import { OrganizationWithCategoryType } from './resolve-organizations.data';

export type ResolveOrganizationsQuery = {
  ids: string[];
};

@Injectable()
export class ResolveOrganizationsHandler {
  constructor(private readonly repository: OrganizationRepository) {}

  execute(
    q: ResolveOrganizationsQuery,
  ): ResultAsync<OrganizationWithCategoryType[], CatalogError> {
    return ResultAsync.combine(
      q.ids.map((id) => this.repository.getWithCategories(id)),
    );
  }
}
