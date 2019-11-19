import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn } from 'typeorm';

import BaseEntityWithTimestamps from './';
import File from './File';

@Entity()
export default class User extends BaseEntityWithTimestamps {
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

  @OneToOne(() => File)
  @JoinColumn({
    name: 'avatar_id',
  })
  avatar!: File;

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
