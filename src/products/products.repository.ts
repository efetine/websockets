import { Inject, Injectable } from '@nestjs/common';
import { CreateDigitalProductDto } from './dto/create-digital-product.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzleAsyncProvider } from '../../db/drizzle.provider';
import * as schema from '../../db/schema';
import { create } from 'domain';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(drizzleAsyncProvider) private db: NodePgDatabase) {}

  async digitalProduct(createDigitalProductDto: CreateDigitalProductDto) {
    const digitalProduct = await this.db.insert(schema.products).values({
      name: createDigitalProductDto.name,
      price: createDigitalProductDto.price,
    });
  }
}
