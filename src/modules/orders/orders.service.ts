import { Injectable } from '@nestjs/common';
import { ordersRepository } from './orders.repository';
import {
  PaginationByUserDto,
  PaginationCursorNumberDto,
} from '../../schemas/pagination.dto';
import { CreateOrderDto } from './dto/create-order-dto';
import { SelectOrder, UpdateOrder } from '../../../db/schemas/orders.schema';
import { PaginatedOrdersDto } from './dto/paginated-orders.dto';

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

  async findAllByUser(
    paginationByUserDto: PaginationByUserDto,
  ): Promise<PaginatedOrdersDto> {
    return await this.ordersRepository.getOrdersByUser(paginationByUserDto);
  }

  async findOne(id: number) {
    return await this.ordersRepository.getOrderById(id);
  }

  async findAllAdmin(
    paginationDto: PaginationCursorNumberDto,
  ): Promise<PaginatedOrdersDto> {
    return await this.ordersRepository.findAllAdmin(paginationDto);
  }

  async update(id: SelectOrder['id'], updateOrderDto: UpdateOrder) {
    return await this.ordersRepository.update(id, updateOrderDto);
  }
}
