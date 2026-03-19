import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
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
import { CreateWorkerDto } from './dto/createWorker.dto';
import { UpdateWorkerDto } from './dto/updateWorker.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { DeleteCategoryDto } from './dto/deleteCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CreateMenuItemDto } from './dto/createMenuItem.dto';
import { DeleteMenuItemDto } from './dto/deleteMenuItem.dto';
import { UpdateMenuItemDto } from './dto/updateMenuItem.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('create/worker')
  createWorker(@Request() req: any, @Body() body: CreateWorkerDto) {
    return this.userService.createWorker(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('staff/:restaurantID')
  getWorkers(@Request() req: any, @Param('restaurantID') restaurantID: string) {
    return this.userService.getStaffMembers(req.user.id, restaurantID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/staff')
  updateWorker(@Request() req: any, @Body() body: UpdateWorkerDto) {
    return this.userService.updateWorker(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/category')
  createCategory(@Request() req: any, @Body() body: CreateCategoryDto) {
    return this.userService.createCategory(req.user.id, body);
  }

  @Get('categories/:restaurantID')
  getCategories(@Param('restaurantID') restaurantID: string) {
    return this.userService.getCategories(restaurantID);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/category')
  deleteCategory(@Request() req: any, @Body() body: DeleteCategoryDto) {
    return this.userService.deleteCategory(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/categories')
  updateCategory(@Request() req: any, @Body() body: UpdateCategoryDto) {
    return this.userService.updateCategory(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/menuItem')
  createMenuItem(@Request() req: any, @Body() body: CreateMenuItemDto) {
    return this.userService.createMenuItem(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/menuItem')
  deleteMenuItem(@Request() req: any, @Body() body: DeleteMenuItemDto) {
    return this.userService.deleteMenuItem(req.user.id, body);
  }

  @Get(':restaurantId/menuItem/:menuItemId')
  getMenuItem(
    @Param('restaurantId', ParseUUIDPipe) restaurantID: string,
    @Param('menuItemId', ParseUUIDPipe) menuItemId: string,
  ) {
    return this.userService.getMenuItemById(restaurantID, menuItemId);
  }

  @Get(':restaurantId/menu')
  getMenu(@Param('restaurantId', ParseUUIDPipe) restaurantID: string) {
    return this.userService.getMenu(restaurantID);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/menuItem')
  updateMenuItem(@Request() req: any, @Body() body: UpdateMenuItemDto) {
    return this.userService.updateMenuItem(req.user.id, body);
  }
}
