import { Exclude } from 'class-transformer';
import { Item } from '../item/item.entity';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Item, (item) => item.user)
  item: Item[];

  @AfterInsert()
  logInstert() {
    console.log('Insterted User with id: ' + this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id:' + this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id:' + this.id);
  }
}
