import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ordersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository:ordersRepository){}

  async create(createOrderDto: CreateOrderDto) {
    return await this.ordersRepository.create(createOrderDto);
  }
}
