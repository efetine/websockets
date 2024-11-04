import { Injectable } from '@nestjs/common';
import { CartsRepository } from './carts.repository';
import { PaginationByUserDto, PaginationByUserStringCursorDto } from '../../schemas/pagination.dto';
import { AddProductToCartDto } from './dto/addProduct.dto';
import { RemoveProductFromCartDto } from './dto/deleteProduct.dto';

@Injectable()
export class CartsService {
  constructor(private readonly cartsRepository: CartsRepository) {}

  async getCartByUserId(paginationByUserDto: PaginationByUserDto) {
    return await this.cartsRepository.getCartByUserId(paginationByUserDto);
  }

  async addProduct(addProductToCartDto: AddProductToCartDto) {
    return await this.cartsRepository.addProduct(addProductToCartDto);
  }

  async removeProduct(removeProductFromCartDto: RemoveProductFromCartDto) {
    return await this.cartsRepository.removeProduct(removeProductFromCartDto);
  }

  async updateQuantity(addProductToCartDto: AddProductToCartDto) {
    return await this.cartsRepository.updateQuantity(addProductToCartDto);
  }
}
