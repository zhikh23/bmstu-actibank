import { Injectable } from '@nestjs/common';
import { GetOrganizationHandler } from '../../use-cases/get-organization/get-organization.handler';
import { Result } from 'neverthrow';
import { OrganizationWithCategoryDto } from './organization-provider.dto';

export type OrganizationProviderError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class OrganizationProvider {
  constructor(
    private readonly getOrganizationHandler: GetOrganizationHandler,
  ) {}

  async getOrganization(
    id: string,
  ): Promise<Result<OrganizationWithCategoryDto, OrganizationProviderError>> {
    return this.getOrganizationHandler.execute({ id });
  }
}
