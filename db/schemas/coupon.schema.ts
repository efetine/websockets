import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  date,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const coupons = pgTable('coupons', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  couponCode: varchar('code', { length: 50 }).unique().notNull(),
  discountPercentage: integer('discount_percentage').notNull(),
  expirationDate: date('expiration_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const insertCouponSchema = createInsertSchema(coupons, {
  id: (schema) => schema.id,
  couponCode: (schema) => schema.couponCode,
  discountPercentage: (schema) => schema.discountPercentage,
  isActive: (schema) => schema.isActive,
});
export type InsertCouponSchema = z.infer<typeof insertCouponSchema>;

export const selectCouponSchema = createSelectSchema(coupons);

export type SelectCouponSchema = z.infer<typeof selectCouponSchema>;

export type CreateCouponDto = typeof coupons.$inferInsert;
export type CouponEntity = typeof coupons.$inferSelect;
