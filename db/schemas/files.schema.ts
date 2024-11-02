import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products } from './products.schema';
import z from 'zod';

export const files = pgTable('images', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: varchar({ length: 255 })
    .references(() => products.id)
    .notNull(),
  publicId: varchar({ length: 255 }).notNull(),
  secureUrl: varchar({ length: 255 }).notNull(),
});

export const imagesInsertSchema = createInsertSchema(files);
export const imagesSelectSchema = createSelectSchema(files);
export type ImageEntity = typeof files.$inferSelect;
export type InsertImage = z.infer<typeof imagesInsertSchema>;
