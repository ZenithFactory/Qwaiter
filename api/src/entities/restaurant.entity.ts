import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  restaurantID: string;

  @Column({ nullable: true })
  ownerID: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150 })
  address: string;

  @ManyToOne(() => User, (user) => user.restaurants, { nullable: true })
  @JoinColumn({ name: 'ownerID' })
  owner: User;
}
