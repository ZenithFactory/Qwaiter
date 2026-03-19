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
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';
import { Table } from '../entities/table.entity';
import { updateTableDto } from './dto/updateTable.dto';
import { CreateWorkerDto } from './dto/createWorker.dto';
import { Staff } from '../entities/staff.entity';
import * as bcrypt from 'bcrypt';
import { UpdateWorkerDto } from './dto/updateWorker.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Category } from '../entities/category.entity';
import { DeleteRestaurantDto } from './dto/deleteRestaurant.dto';
import { DeleteCategoryDto } from './dto/deleteCategory.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Table)
    private tableRepository: Repository<Table>,

    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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

  async getRestaurantsByOwner(ownerID: string) {
    const restaurants = await this.restaurantRepository.find({
      where: { ownerID: ownerID },
    });

    if (!restaurants)
      throw new NotFoundException("You don't have restaurants!");

    return restaurants;
  }

  async updateRestaurant(
    ownerID: string,
    restaurantID: string,
    dto: UpdateRestaurantDto,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');
    if (ownerID !== restaurant.ownerID)
      throw new ForbiddenException(
        "You can't update someone else's restaurant!",
      );

    if (dto.restaurantName) restaurant.restaurantName = dto.restaurantName;
    if (dto.address) restaurant.address = dto.address;

    await this.restaurantRepository.save(restaurant);
    return {
      message: 'Restaurant was successfully updated',
      restaurant,
    };
  }

  async createTable(
    ownerID: string,
    restaurantID: string,
    tableName: string,
    authCode: string,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');
    if (restaurant.ownerID !== ownerID)
      throw new ForbiddenException(
        "You can't create a table for someone else's restaurant!",
      );

    const table = this.tableRepository.create({
      restaurantID: restaurant.restaurantID,
      tableName,
      authCode,
    });

    await this.tableRepository.save(table);

    return {
      message: 'Table was created successfully!',
      table,
    };
  }

  async deleteTable(ownerID: string, restaurantID: string, tableID: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');

    if (ownerID !== restaurant.ownerID)
      throw new ForbiddenException(
        "You can't delete someone else's restaurant's table!",
      );

    const table = await this.tableRepository.findOne({
      where: { tableID, restaurantID: restaurant.restaurantID },
    });

    if (!table)
      throw new NotFoundException('Table not found in this restaurant!');

    await this.tableRepository.delete({ tableID: table.tableID });

    return { message: 'Table was successfully deleted!' };
  }

  async getTablesByRestaurant(ownerID: string, restaurantID: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID, ownerID },
      relations: ['tables'],
    });

    if (!restaurant)
      throw new NotFoundException(
        "Restaurant not found or you don't own this restaurant!",
      );

    return restaurant.tables;
  }

  async updateTable(ownerID: string, dto: updateTableDto) {
    const restaurantID = dto.restaurantID;
    const tableID = dto.tableID;

    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');

    if (ownerID !== restaurant.ownerID)
      throw new ForbiddenException(
        "You can't update a table of someone else's restaurant!",
      );

    const table = await this.tableRepository.findOne({
      where: { tableID, restaurantID: restaurant.restaurantID },
    });

    if (!table)
      throw new NotFoundException('Table not found in this restaurant!');

    if (dto.tableName !== undefined) table.tableName = dto.tableName;
    if (dto.authCode !== undefined) table.authCode = dto.authCode;

    await this.tableRepository.save(table);

    return {
      message: 'Table was successfully updated!',
      table,
    };
  }
  async createWorker(ownerID: string, dto: CreateWorkerDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID: dto.restaurantID },
      relations: ['staffMembers'],
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');
    if (ownerID !== restaurant.ownerID)
      throw new ForbiddenException(
        "You can't create worker to someone else's restaurant!",
      );

    const existingWorker = restaurant.staffMembers.find(
      (staff) => staff.username == dto.username,
    );

    if (existingWorker)
      throw new ConflictException('Username already taken in this restaurant!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const staff = this.staffRepository.create({
      name: dto.name,
      username: dto.username,
      password: hashedPassword,
      role: dto.role,
      restaurant: restaurant,
    });

    await this.staffRepository.save(staff);
    return {
      message: 'Worker created successfully',
      worker: {
        name: staff.name,
        username: staff.username,
        role: staff.role,
      },
    };
  }

  async getStaffMembers(ownerID: string, restaurantID: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID: restaurantID },
      relations: ['staffMembers'],
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');
    if (ownerID !== restaurant.ownerID)
      throw new ForbiddenException(
        "You can't get someone else's restaurant staff members!",
      );

    return restaurant.staffMembers;
  }

  async updateWorker(ownerID: string, dto: UpdateWorkerDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID: dto.restaurantID },
      relations: ['staffMembers'],
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');
    if (ownerID !== restaurant.ownerID)
      throw new ForbiddenException(
        "You can't update someone else's restaurant staff member!",
      );

    const worker = await this.staffRepository.findOne({
      where: { id: dto.workerID },
    });
    if (!worker) throw new NotFoundException('Worker not found!');

    const workerInRestaurant = restaurant.staffMembers.find(
      (staff) => staff.id == dto.workerID,
    );

    if (!workerInRestaurant)
      throw new ForbiddenException(
        'This worker does not belong to this restaurant!',
      );

    if (dto.name) worker.name = dto.name;
    if (dto.username) worker.username = dto.username;
    if (dto.password) worker.password = await bcrypt.hash(dto.password, 10);
    if (dto.role) worker.role = dto.role;

    await this.staffRepository.save(worker);

    return {
      message: 'Worker updated successfully!',
      worker: {
        name: worker.name,
        username: worker.username,
        role: worker.role,
      },
    };
  }

  async createCategory(ownerID: string, dto: CreateCategoryDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID: dto.restaurantID },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');

    if (restaurant.ownerID != ownerID)
      throw new ForbiddenException(
        "You can't add category to someon else's restaurant!",
      );

    const category = await this.categoryRepository.findOne({
      where: { name: dto.categoryName, restaurantID: dto.restaurantID },
    });

    if (category) throw new ConflictException('Category already exists!');

    const newCategory = this.categoryRepository.create({
      restaurantID: dto.restaurantID,
      name: dto.categoryName,
      displayOrder: dto.displayOrder,
    });

    const savedCategory = await this.categoryRepository.save(newCategory);

    return savedCategory;
  }

  async getCategories(restaurantID: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID: restaurantID },
      relations: ['categories'],
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');

    return restaurant.categories;
  }

  async deleteCategory(ownerID: string, dto: DeleteCategoryDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurantID: dto.restaurantID },
      relations: ['categories'],
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found!');
    if (restaurant.ownerID !== ownerID)
      throw new ForbiddenException(
        "You can't delete categories for someone else's restaurant!",
      );

    const category = restaurant.categories.find(
      (cat) => cat.id == dto.categoryID,
    );

    if (!category)
      throw new NotFoundException('Category not found in this restaurant!');

    await this.categoryRepository.delete({ id: category.id });
    return { message: 'Category deleted successfully!' };
  }
}
