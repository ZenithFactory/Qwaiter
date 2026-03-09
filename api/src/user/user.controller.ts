import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { DeleteRestaurantDto } from './dto/deleteRestaurant.dto';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';
import { createTableDto } from './dto/createTable.dto';
import { deleteTableDto } from './dto/deleteTable.dto';
import { updateTableDto } from './dto/updateTable.dto';

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/restaurant')
  createRestaurant(@Req() req: AuthRequest, @Body() body: CreateRestaurantDto) {
    const ownerID = req.user.id;
    return this.userService.createRestaurant(
      ownerID,
      body.restaurantName,
      body.address,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/restaurant')
  deleteRestaurant(@Req() req: AuthRequest, @Body() body: DeleteRestaurantDto) {
    const ownerID = req.user.id;
    return this.userService.deleteRestaurant(ownerID, body.restaurantID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('restaurants')
  getRestaurantByOwner(@Req() req: AuthRequest) {
    return this.userService.getRestaurantsByOwner(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/restaurant/:id')
  updateRestaurant(
    @Req() req: AuthRequest,
    @Param('id') restaurantID: string,
    @Body() body: UpdateRestaurantDto,
  ) {
    return this.userService.updateRestaurant(req.user.id, restaurantID, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/table')
  createTable(@Req() req: AuthRequest, @Body() body: createTableDto) {
    const ownerID = req.user.id;
    return this.userService.createTable(
      ownerID,
      body.restaurantID,
      body.tableName,
      body.authCode,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/table')
  deleteTable(@Req() req: AuthRequest, @Body() body: deleteTableDto) {
    const ownerID = req.user.id;
    return this.userService.deleteTable(
      ownerID,
      body.restaurantID,
      body.tableID,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/table')
  updateTable(@Req() req: AuthRequest, @Body() body: updateTableDto) {
    const ownerID = req.user.id;
    return this.userService.updateTable(ownerID, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tables/:restaurantID')
  getTableByRestaurant(
    @Req() req: AuthRequest,
    @Param('restaurantID') restaurantID: string,
  ) {
    return this.userService.getTablesByRestaurant(req.user.id, restaurantID);
  }
}
