import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { InsertProduct } from '../../db/schema';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }
  
  create(body: InsertProduct) {
    return this
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number ) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
