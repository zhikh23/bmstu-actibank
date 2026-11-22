import { Injectable } from '@nestjs/common';

import { CatalogService } from '@/catalog/presentation/catalog.service';
import { GetAllOrganizationsHandler } from '@/catalog/use-cases/get-all-organizations/get-all-organizations.handler';
import { ResolveOrganizationsHandler } from '@/catalog/use-cases/resolve-organizations/resolve-organizations.handler';
import { OrganizationWithCategoryDto } from '@/shared/presentation/dto/organization-with-category.dto';
import { OrganizationDto } from '@/shared/presentation/dto/organization.dto';

@Injectable()
export class OrganizationsService extends CatalogService {
  constructor(
    private readonly allOrganizations: GetAllOrganizationsHandler,
    private readonly organizations: ResolveOrganizationsHandler,
  ) {
    super();
  }

  getAllOrganizations(): Promise<OrganizationDto[]> {
    return this.resolve(this.allOrganizations.execute());
  }

  resolveOrganizations(ids: string[]): Promise<OrganizationWithCategoryDto[]> {
    return this.resolve(this.organizations.execute({ ids }));
  }
}
