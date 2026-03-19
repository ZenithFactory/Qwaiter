import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

export enum StaffRole {
  ADMIN = 'admin',
  WAITER = 'waiter',
  KITCHEN = 'kitchen',
}

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: StaffRole,
    default: StaffRole.WAITER,
  })
  role: StaffRole;

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;
}
