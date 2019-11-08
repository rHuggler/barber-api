import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn} from 'typeorm';

@Entity()
export default class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  path!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt!: Date;

  protected url!: string;

  @AfterLoad()
  getUrl() {
    this.url = `http://localhost:5000/files/${this.path}`;
  }
}
