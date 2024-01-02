import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
