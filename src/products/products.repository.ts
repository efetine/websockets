import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzleAsyncProvider } from '../../db/drizzle.provider';
import * as schema from '../../db/schema';
import { create } from 'domain';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(drizzleAsyncProvider) private db: NodePgDatabase) {}

  
}
