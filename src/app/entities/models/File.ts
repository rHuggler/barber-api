import {
  AfterLoad,
  Column,
  Entity,
  PrimaryGeneratedColumn } from 'typeorm';

import BaseEntityWithTimestamps from './';

@Entity()
export default class File extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  path!: string;

  protected url!: string;

  @AfterLoad()
  getUrl() {
    this.url = `http://localhost:5000/files/${this.path}`;
  }
}
