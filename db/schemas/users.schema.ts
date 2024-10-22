import { relations } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { orders } from './orders.schema';

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  password: text('password'),
  image: text('image').default('default_profile_picture.png').notNull(),
  active: boolean().default(true).notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

const insertUserSchema = createInsertSchema(users);
export type CreateUserDto = z.infer<typeof insertUserSchema>;
