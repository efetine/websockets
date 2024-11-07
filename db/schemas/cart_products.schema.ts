import { integer, unique } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { carts } from './cart.schema';
import { products } from './products.schema';
import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/pg-core';

export const cartAndProducts = pgTable(
  'cart_products',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    cartId: integer('cart_id')
      .references(() => carts.id, { onDelete: 'cascade' })
      .notNull(),
    productId: text('product_id')
      .references(() => products.id)
      .notNull(),
    quantity: integer('quantity').notNull().default(1),
  },
  (table) => ({
    unq: unique().on(table.cartId, table.productId),
  }),
);

export const cartAndProductsRelations = relations(
  cartAndProducts,
  ({ one }) => ({
    cart: one(carts, {
      fields: [cartAndProducts.cartId],
      references: [carts.id],
    }),
    product: one(products, {
      fields: [cartAndProducts.productId],
      references: [products.id],
    }),
  }),
);
