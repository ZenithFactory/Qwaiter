import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column({ length: 50 })
  username: string;

  @Column({ unique: true, length: 256 })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
