import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { DeleteRestaurantDto } from './dto/deleteRestaurant.dto';

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

  @UseGuards(JwtAuthGuard)
  @Delete('delete/restaurant')
  deleteRestaurant(@Request() req: any, @Body() body: DeleteRestaurantDto) {
    const ownerID = req.user.id;
    return this.userService.deleteRestaurant(ownerID, body.restaurantID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('restaurant/:id')
  getRestaurant(@Request() req: any, @Param('id') restaurantID: string) {
    return this.userService.getRestaurantByID(req.user.id, restaurantID);
  }
}
