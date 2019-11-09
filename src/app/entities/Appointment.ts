import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn} from 'typeorm';

import User from './User';

@Entity()
export default class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column({ name: 'canceled_at', nullable: true })
  canceledAt!: Date;

  @OneToOne('User')
  @JoinColumn({
    name: 'user_id',
  })
  userId!: User;

  @JoinColumn({
    name: 'provider_id',
  })
  providerId!: User;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false})
  updatedAt!: Date;
}
