import {
  AfterLoad,
  Column,
  Entity,
  PrimaryGeneratedColumn } from 'typeorm';

import BaseEntityWithTimestamps from './';

const APP_URL = process.env.APP_URL || 'localhost';
const APP_PORT = process.env.APP_PORT || '5000';

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
    this.url = `${APP_URL}:${APP_PORT}/files/${this.path}`;
  }
}
