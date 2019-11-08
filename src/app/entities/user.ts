import { compareSync, hashSync } from 'bcryptjs';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn} from 'typeorm';

import File from './file';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
    default: false,
  })
  provider!: boolean;

  @OneToOne('File')
  @JoinColumn({
    name: 'avatar_id',
  })
  avatarId!: File;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    this.password = hashSync(this.password, 6);
  }

  checkPassword(password: string): boolean {
    return compareSync(password, this.password);
  }
}
