import { relations } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { orders } from './orders.schema';

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  password: text('password'),
  username: text('username'),
  image: text('image').default('default_profile_picture.png').notNull(),
  active: boolean().default(true).notNull(),
  tokenConfirmation: text('tokenConfirmation'),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users).pick({
  id: true,
  name: true,
  email: true,
  image: true,
});
export type CreateUserDto = z.infer<typeof insertUserSchema>;
export type UserEntity = typeof users.$inferInsert;

export type SelectUserDto = z.infer<typeof selectUserSchema>;