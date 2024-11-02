import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { paginationByUserDto, paginationCursorNumberDto, paginationDto } from '../../schemas/pagination.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('findAllByUser')
  findAllByUser(
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @Query('userId') userId: string,
  ) {
    const validation = paginationByUserDto.safeParse({ cursor, limit, userId })

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return this.ordersService.findAllByUser(validation.data);
  }

  @Get('findAll')
  findAllAdmin(
    @Query('limit') limit: number,
    @Query('cursor') cursor?: number,
  ) {
    const validation = paginationCursorNumberDto.safeParse({ cursor, limit });
    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }
    return this.ordersService.findAllAdmin(validation.data);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }
}
