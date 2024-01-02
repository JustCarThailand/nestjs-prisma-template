import { Exclude } from 'class-transformer';
import { AbstractEntity } from '../common/database';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends AbstractEntity<User> {
  @Column()
  username: string;
  @BeforeInsert()
  nameToLowerCase() {
    this.username = this.username.toLowerCase();
  }

  @Column()
  @Exclude()
  password_hash: string;

  @Column()
  @Exclude()
  password_iter: number;

  @Column()
  @Exclude()
  password_salt: string;

  @Column()
  role_name: string;

  @Column()
  role_code: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  signed_in: Date;
}
