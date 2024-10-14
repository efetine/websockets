import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { POSTGRES_URL } from '../src/config/enviroments.config';
import * as schema from './schema';

export const drizzleAsyncProvider = 'DRIZZLE_DB';

export const drizzleProvider = [
  {
    provide: drizzleAsyncProvider,
    useFactory: async () => {
      const pool = new Pool({ connectionString: POSTGRES_URL });
      return drizzle(pool, { schema: schema });
    },
    exports: [drizzleAsyncProvider],
  },
];
