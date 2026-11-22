import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { OrganizationRepository } from '@/catalog/infra/repository/organization/organization.repository';

import { OrganizationType } from './get-all-organizations.data';

@Injectable()
export class GetAllOrganizationsHandler {
  constructor(private readonly repository: OrganizationRepository) {}

  execute(): ResultAsync<OrganizationType[], CatalogError> {
    return this.repository.getAll();
  }
}
