import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
}
