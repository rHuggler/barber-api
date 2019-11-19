import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class BaseEntityWithTimestamps extends BaseEntity {
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt!: Date;
}
