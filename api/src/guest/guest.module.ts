import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { GuestGuard } from './guest.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from '../entities/table.entity';
import { MenuItem } from '../entities/menuitem.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([Table, MenuItem, Order, OrderItem]),
  ],
  controllers: [GuestController],
  providers: [GuestService, GuestGuard],
  exports: [GuestService],
})
export class GuestModule {}
