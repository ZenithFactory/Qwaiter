import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestGuard } from './guest.guard';
import { CreateOrderDto } from './dto/order-item.dto';
import { LeaveTableDto } from './dto/leave-table.dto';

@Controller('guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @UseGuards(GuestGuard)
  @Get('table/:token')
  async getTable(@Param('token') token: string) {
    return this.guestService.getTable(token);
  }

  @UseGuards(GuestGuard)
  @Post('order')
  async order(@Body() body: CreateOrderDto) {
    return this.guestService.createOrder(body);
  }

  @UseGuards(GuestGuard)
  @Post('leave-table')
  async leaveTable(@Body() body: LeaveTableDto) {
    return this.guestService.leaveTable(body);
  }
}
