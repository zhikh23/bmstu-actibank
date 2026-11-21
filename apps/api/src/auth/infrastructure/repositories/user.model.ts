import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { UserRole } from '@/shared/domain/authenticated-user.entity';

@Entity('users')
@Unique(['subject'])
export class UserModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare subject: string;

  @OneToMany(() => UserRoleModel, (role) => role.user, { cascade: true })
  declare roles: Relation<UserRoleModel[]>;
}

@Entity('user_roles')
export class UserRoleModel {
  @PrimaryColumn('uuid')
  declare user_id: string;

  @PrimaryColumn('varchar')
  declare role: UserRole;

  @ManyToOne(() => UserModel, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  declare user: Relation<UserModel>;
}
