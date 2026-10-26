import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';

@Entity('organization_categories')
export class OrganizationCategoryModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;

  @Column('uuid', { nullable: true })
  declare parent_id: string | null;

  @ManyToOne(() => OrganizationCategoryModel, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  declare parent: Relation<OrganizationCategoryModel | null>;

  @OneToMany(() => OrganizationCategoryModel, (category) => category.parent, {
    cascade: true,
  })
  declare children: OrganizationCategoryModel[];

  @OneToMany(() => OrganizationModel, (organization) => organization.category, {
    cascade: true,
  })
  declare organizations: OrganizationModel[];
}

@Entity('organizations')
export class OrganizationModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;

  @Column('uuid')
  declare category_id: string;

  @ManyToOne(
    () => OrganizationCategoryModel,
    (category) => category.organizations,
  )
  @JoinColumn({ name: 'category_id' })
  declare category: Relation<OrganizationCategoryModel>;
}
