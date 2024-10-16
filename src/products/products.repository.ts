import { Injectable } from '@nestjs/common';
import { db } from '../config/db';
import { InsertProduct, products } from '../../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsRepository {
  constructor() {}

  async findAll() {
    return await db.query.products.findMany({
      with: { category: { columns: { name: true } } },
      columns: { categoryId: false },
    });
  }

  async create(productData: InsertProduct) {
    
    return await db.insert(products).values(productData);
  }

  async findOne(id: string) {
    return await db.query.products.findFirst({
      where: (fields) => eq(fields.id, id),
    });
  }

  async update(id: string, productData: Partial<InsertProduct>) {
    return await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning({
        id: products.id,
        price: products.price,
        description: products.description,
        type: products.type,
        stock: products.stock,
        name: products.name,
        categoryId: products.categoryId,
      });
  }

  async remove(id: string) {
    return await db.delete(products).where(eq(products.id, id));
  }
}
