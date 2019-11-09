import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';
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

import File from './File';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ select: false })
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

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false})
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword(): void {
    if (this.password) {
      this.password = hashSync(this.password, 6);
    }
  }

  checkPassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  regeneratePassword(): string {
    this.password = randomBytes(8).toString('hex');
    return this.password;
  }
}
