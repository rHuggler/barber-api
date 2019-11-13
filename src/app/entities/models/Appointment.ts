import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn } from 'typeorm';

@Entity()
export default class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: string;

  @Column({ name: 'canceled_at', nullable: true })
  canceledAt!: Date;

  @ManyToOne('User')
  @JoinColumn({
    name: 'user_id',
  })
  userId!: number;

  @ManyToOne('User')
  @JoinColumn({
    name: 'provider_id',
  })
  providerId!: number;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false})
  updatedAt!: Date;
}
