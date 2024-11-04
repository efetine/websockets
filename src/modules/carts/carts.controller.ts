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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { ApiTags } from '@nestjs/swagger';
import { paginationByUserDto } from '../../schemas/pagination.dto';
import { addProductToCartDto } from './dto/addProduct.dto';
import { removeProductFromCartDto } from './dto/deleteProduct.dto';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getCartByUserId(
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @Req()
    request: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
  ) {
    const validation = paginationByUserDto.safeParse({
      cursor,
      limit,
      userId: request.user.id,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.getCartByUserId(validation.data);
  }

  @UseGuards(AuthGuard)
  @Post()
  async addProductInCart(
    @Req()
    req: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
    @Query('product') productId: string,
    @Query('quantity') quantity: number,
  ) {
    quantity = Number(quantity) || 1;

    const validation = addProductToCartDto.safeParse({
      userId: req.user.id,
      productId,
      quantity,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.addProduct(validation.data);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteProductCart(
    @Req()
    req: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
    @Query('product') productId: string,
  ) {
    const validation = removeProductFromCartDto.safeParse({
      userId: req.user.id,
      productId,
    });
    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.removeProduct(validation.data);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateQuantity(
    @Req()
    req: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
    @Query('product') productId: string,
    @Query('quantity') quantity: string | number,
  ) {
    quantity = Number(quantity) || 1;

    const validation = addProductToCartDto.safeParse({
      userId: req.user.id,
      productId,
      quantity,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.updateQuantity(validation.data);
  }
}

