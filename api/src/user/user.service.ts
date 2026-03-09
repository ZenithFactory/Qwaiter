import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async createRestaurant(
    ownerID: string,
    restaurantName: string,
    address: string,
  ) {
    const restaurant = this.restaurantRepository.create({
      ownerID,
      restaurantName,
      address,
    });

    await this.restaurantRepository.save(restaurant);
    return {
      message: 'Restaurant was created successfully!',
      restaurant: restaurant,
    };
  }

  async deleteRestaurant(ownerID: string, restaurantID: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');

    if (ownerID !== restaurant.ownerID)
      throw new ForbiddenException(
        "You can't delete someone else's restaurant!",
      );

    await this.restaurantRepository.delete({
      restaurantID: restaurant.restaurantID,
    });
    return { message: 'Restaurant was successfully deleted!' };
  }

  async getRestaurantByID(ownerID: string, restaurantID: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');

    return restaurant;
  }
}
