import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { ApiTags } from '@nestjs/swagger';
import { paginationByUserDto } from '../../schemas/pagination.dto';
import { addProductToCartDto } from './dto/addProduct.dto';
import { removeProductFromCartDto } from './dto/deleteProduct.dto';

@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async getCartByUserId(
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @Query('userId') userId: string,
  ) {

    const validation = paginationByUserDto.safeParse({
      cursor,
      limit,
      userId,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.getCartByUserId(validation.data);
  }

  @Post()
  async createOrAddCart(
    @Query('user') userId: string,
    @Query('product') productId: string,
    @Query('quantity') quantity: string | number = 1
  ) {

    quantity = Number(quantity) || 1

    const validation = addProductToCartDto.safeParse({
      userId,
      productId,
      quantity
    })

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.addProduct(validation.data);
  }

  @Delete()
  async deleteProductCart(@Query('user') userId: string, @Query('product') productId: string) {
    const validation = removeProductFromCartDto.safeParse({
      userId,
      productId,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.removeProduct(validation.data);
  }

  @Patch()
  async updateQuantity(
    @Query('user') userId: string,
    @Query('product') productId: string,
    @Query('quantity') quantity: string | number
  ) {

    quantity = Number(quantity) || 1

    const validation = addProductToCartDto.safeParse({
      userId,
      productId,
      quantity
    })

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.updateQuantity(validation.data);
  }
}

