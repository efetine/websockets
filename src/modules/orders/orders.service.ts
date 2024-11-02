import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ordersRepository } from './orders.repository';
import {
  PaginationByUserDto,
  PaginationCursorNumberDto,
  PaginationDto,
} from '../../schemas/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: ordersRepository) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.ordersRepository.create(createOrderDto);
  }

  async updateToPayment(updateOrderDto: any) {
    const dbResponse =
      await this.ordersRepository.updateToPayment(updateOrderDto);
    if (!dbResponse) throw new Error('Error updating order');
    return dbResponse;
  }

  async findAllByUser(paginationByUserDto: PaginationByUserDto) {
    return await this.ordersRepository.getOrdersByUser(paginationByUserDto);
  }

  async findOne(id: number) {
    return await this.ordersRepository.getOrderById(id);
  }

  async findAllAdmin(paginationDto: PaginationCursorNumberDto) {
    return await this.ordersRepository.findAllAdmin(paginationDto);
  }
}
