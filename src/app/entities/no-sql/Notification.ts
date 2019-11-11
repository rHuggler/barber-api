import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class Notification extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  content!: string;

  @Column()
  userId!: number;

  @Column({ default: false })
  read!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
