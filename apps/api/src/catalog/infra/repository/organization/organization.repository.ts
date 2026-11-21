import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { IsNull, Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';
import { Organization } from '@/catalog/domain/organization.entity';

import {
  OrganizationCategory,
  OrganizationWithCategory,
} from './organization-with-category.read-model';
import {
  OrganizationMapper,
  OrganizationWithCategoryMapper,
} from './organization.mapper';
import {
  OrganizationCategoryModel,
  OrganizationModel,
} from './organization.model';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectRepository(OrganizationModel)
    private readonly repository: Repository<OrganizationModel>,
  ) {}

  getAll(): ResultAsync<Organization[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) =>
      models.map((model) => OrganizationMapper.toDomain(model)),
    );
  }

  getRootCategories(): ResultAsync<OrganizationCategory[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.manager.getRepository(OrganizationCategoryModel).find({
        where: { parent_id: IsNull() },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(({ id, name }) => ({ id, name })));
  }

  getChildCategories(
    parentId: string,
  ): ResultAsync<OrganizationCategory[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.manager.getRepository(OrganizationCategoryModel).find({
        where: { parent_id: parentId },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(({ id, name }) => ({ id, name })));
  }

  getByCategory(categoryId: string): ResultAsync<Organization[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { category_id: categoryId },
        relations: { category: true },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) =>
      models.map((model) => OrganizationMapper.toDomain(model)),
    );
  }

  getWithCategories(
    id: string,
  ): ResultAsync<OrganizationWithCategory, CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({ where: { id } }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    )
      .andThen((organization) =>
        organization
          ? okAsync(organization)
          : errAsync(
              CatalogError.notFound(`organization with id "${id}" not found`),
            ),
      )
      .andThen((organization) =>
        ResultAsync.fromPromise(
          this.repository.query(
            `
          with recursive category_tree as (
            select *
            from organization_categories
            where id = $1
          union all
            select c.*
            from organization_categories c
            inner join category_tree ct on c.id = ct.parent_id
          )
          select *
          from category_tree c
        `,
            [organization.category_id],
          ),
          (error): CatalogError =>
            CatalogError.repository(
              error instanceof Error ? error.message : String(error),
            ),
        ).map(
          (
            rows,
          ): {
            organization: OrganizationModel;
            rows: OrganizationCategoryModel[];
          } => ({ organization, rows }),
        ),
      )
      .andThen(({ organization, rows }) => {
        if (rows.length === 0) {
          return errAsync(
            CatalogError.repository(
              `organization category with id "${organization.category_id}" not found`,
            ),
          );
        }

        const byId = new Map<string, OrganizationCategoryModel>(
          rows.map((row) => [row.id, row]),
        );

        // Хэлпер, заполняющий рекурсивно parent у категории с обработкой всех краевых случаев.
        const attachParent = (
          node: OrganizationCategoryModel,
        ): OrganizationCategoryModel => {
          const parent = node.parent_id
            ? (byId.get(node.parent_id) ?? null)
            : null;
          return { ...node, parent: parent ? attachParent(parent) : null };
        };

        const root = byId.get(organization.category_id) ?? rows[0];

        return okAsync(
          OrganizationWithCategoryMapper.toReadModel({
            ...organization,
            category: attachParent(root),
          }),
        );
      });
  }
}
