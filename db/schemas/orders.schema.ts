import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  varchar,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { products } from './products.schema';
import { createInsertSchema } from 'drizzle-zod';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'cancelled',
]);

export const orders = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  mpOrderId: varchar('mp_order_id', { length: 256 }).unique(),
  userId: uuid().references(() => users.id, { onDelete: 'cascade' }),
  orderEstatus: orderStatusEnum('order_status').default('pending'),
  isPaid: boolean('is_paid').default(false),
  createdAt: varchar('created_at', { length: 256 }).default(
    new Date().toISOString(),
  ),
});

export type insertOrders = typeof orders.$inferInsert;
export type selectOrders = typeof orders.$inferSelect;
export const InsertOrderSchema = createInsertSchema(orders);

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users),
  ordersDetails: one(ordersDetails),
}));

export const ordersDetails = pgTable('orders_details', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').references(() => orders.id),
  productId: uuid('product_id').references(() => products.id),
  quantity: integer('quantity'),
  price: integer('price'),
});

export type insertOrdersDetails = typeof ordersDetails.$inferInsert;
export type selectOrdersDetails = typeof ordersDetails.$inferSelect;
export const InsertOrderDetailsSchema = createInsertSchema(ordersDetails);