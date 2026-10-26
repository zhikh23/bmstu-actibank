import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';

@Entity('role_categories')
export class RoleCategoryModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;

  @OneToMany(() => RoleModel, (role) => role.category, { cascade: true })
  declare roles: RoleModel[];
}

@Entity('roles')
export class RoleModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('uuid')
  declare category_id: string;

  @Column('varchar')
  declare name: string;

  @ManyToOne(() => RoleCategoryModel, (category) => category.roles)
  @JoinColumn({ name: 'category_id' })
  declare category: Relation<RoleCategoryModel>;
}
