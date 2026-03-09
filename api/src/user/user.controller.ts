import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/restaurant')
  createRestaurant(@Request() req: any, @Body() body: CreateRestaurantDto) {
    const ownerID = req.user.id;
    return this.userService.createRestaurant(
      ownerID,
      body.restaurantName,
      body.address,
    );
  }
}
