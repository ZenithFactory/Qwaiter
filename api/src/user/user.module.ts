import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Restaurant])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
