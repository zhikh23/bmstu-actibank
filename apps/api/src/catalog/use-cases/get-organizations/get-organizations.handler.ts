import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../../infra/repository/organization/organization.repository';
import { ResultAsync } from 'neverthrow';
import { OrganizationWithCategoryType } from './get-organizations.data';
import { CatalogError } from '../../domain/errors';

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
