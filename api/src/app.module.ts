import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { Table } from './entities/table.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { MenuItem } from './entities/menuitem.entity';
import { Category } from './entities/category.entity';
import { Staff } from './entities/staff.entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get<string>('DB_HOST'),
        port: parseInt(ConfigService.get<string>('DB_PORT') ?? '5432', 10),
        username: ConfigService.get<string>('DB_USER'),
        password: ConfigService.getOrThrow<string>('DB_PASS'), // ← ez volt a gond
        database: ConfigService.get<string>('DB_NAME'),
        entities: [
          User,
          Restaurant,
          Table,
          Order,
          OrderItem,
          MenuItem,
          Category,
          Staff,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    MailModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
