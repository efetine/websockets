import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { create } from 'domain';
import { db } from '../config/db';

@Injectable()
export class ProductsRepository {


  async findAll(){
    return await db.query.products.findMany({ with: { category:{columns:{name:true}} }, columns:{categoryId:false} });
  }
}
