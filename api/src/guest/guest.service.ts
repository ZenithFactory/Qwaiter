import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { CreateOrderDto } from './dto/order-item.dto';
import { MenuItem } from '../entities/menuitem.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { LeaveTableDto } from './dto/leave-table.dto';

@Injectable()
export class GuestService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Table)
    private tableRepository: Repository<Table>,

    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  generateGuestToken() {
    const payload = {
      sub: randomUUID(),
      type: 'guest',
    };

    return this.jwtService.sign(payload);
  }

  async getTable(token: string) {
    const table = await this.tableRepository.findOne({
      where: { QRCodeToken: token },
      relations: [
        'restaurant',
        'restaurant.categories',
        'restaurant.categories.items',
      ],
    });

    if (!table) {
      throw new NotFoundException('Table not found! (Invalid QR Code)');
    }

    return {
      table: {
        tableID: table.tableID,
        tableName: table.tableName,
        authCode: table.authCode,
        restaurantID: table.restaurant.restaurantID,
      },
      restaurant: {
        restaurantID: table.restaurant.restaurantID,
        restaurantName: table.restaurant.restaurantName,
      },
      menu: table.restaurant.categories,
    };
  }

  async createOrder(dto: CreateOrderDto) {
    const table = await this.tableRepository.findOne({
      where: { tableID: dto.tableID },
      relations: ['restaurant'],
    });

    if (!table) throw new NotFoundException('Table not found!');
    if (table.authCode !== dto.authCode)
      throw new BadRequestException('Wrong table code!');

    // GET all menu item by IDs
    const menuItemIds = dto.items.map((item) => item.menuItemID);
    const menuItems = await this.menuItemRepository.findByIds(menuItemIds);

    if (menuItems.length !== menuItemIds.length)
      throw new BadRequestException('One or more menu item not found!');

    // Create the order
    const order = this.orderRepository.create({
      tableID: dto.tableID,
      restaurantID: table.restaurant.restaurantID,
      status: OrderStatus.PENDING,
      totalAmount: 0,
    });

    const savedOrder = await this.orderRepository.save(order);

    let total = 0;
    const orderItems = dto.items.map((dtoItem) => {
      const menuItem = menuItems.find((m) => m.id === dtoItem.menuItemID)!;
      const itemTotal = Number(menuItem.price) * dtoItem.quantity;
      total += itemTotal;

      return this.orderItemRepository.create({
        orderID: savedOrder.id,
        menuItemID: dtoItem.menuItemID,
        quantity: dtoItem.quantity,
        unitPrice: menuItem.price,
      });
    });

    await this.orderItemRepository.save(orderItems);

    savedOrder.totalAmount = total;
    await this.orderRepository.save(savedOrder);

    return {
      message: 'Order successfully placed!',
      orderID: savedOrder.id,
      totalAmount: total,
    };
  }

  async leaveTable(dto: LeaveTableDto) {
    const table = await this.tableRepository.findOne({
      where: { tableID: dto.tableID },
    });

    if (!table) throw new NotFoundException('Table not found!');

    if (table.authCode !== dto.authCode)
      throw new BadRequestException('Wrong table code!');

    return {
      message: 'Table successfully leaved. Thank you for visiting!',
      tableID: table.tableID,
      tableName: table.tableName,
    };
  }
}
