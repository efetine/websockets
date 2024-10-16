import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { InsertProduct } from '../../db/schema';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(body: InsertProduct) {
    return await this.productsRepository.create(body);
  }

  async findAll() {
    return await this.productsRepository.findAll();
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: string, productData: Partial<InsertProduct>) {
    return await this.productsRepository.update(id, productData);
  }

  async remove(id: string) {
    const product = await this.productsRepository.remove(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }
}
