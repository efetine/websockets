import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags } from '@nestjs/swagger';
import {
  paginationByUserDto,
  paginationCursorNumberDto,
} from '../../schemas/pagination.dto';
import {
  UpdateOrder,
  updateOrderSchema,
} from '../../../db/schemas/orders.schema';

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
    const validation = paginationByUserDto.safeParse({ cursor, limit, userId });

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

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrder) {
    console.log({ id, updateOrderDto });
    const validation = updateOrderSchema.safeParse(updateOrderDto);

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return this.ordersService.update(id, updateOrderDto);
  }
}
