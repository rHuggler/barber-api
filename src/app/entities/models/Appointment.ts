import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn} from 'typeorm';

import { isBefore, subHours } from 'date-fns';
import BaseEntityWithTimestamps from './';
import User from './User';

@Entity()
export default class Appointment extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column({ name: 'canceled_at', nullable: true })
  canceledAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'provider_id',
  })
  provider!: User;

  protected past!: boolean;

  protected cancellable!: boolean;

  @AfterLoad()
  getPast() {
    this.past = isBefore(this.date, new Date());
  }

  @AfterLoad()
  getCancellable() {
    this.cancellable = isBefore(new Date(), subHours(this.date, 2));
  }
}
