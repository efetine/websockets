import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { validateHeaderName } from 'http';

const id = uuid().primaryKey().defaultRandom();

export const roleEnum = pgEnum('role_enum', [
  'CUSTOMER',
  'ADMIN',
  'PROVIDER',
  'OWNER',
]);

export const productTypeEnum = pgEnum('type_product_enum', [
  'DIGITAL',
  'PHISICAL',
]);

export const users = pgTable('users', {
  id,
  fullname: varchar({ length: 25 }).notNull(),
  role: roleEnum(),
  phone: integer().notNull(),
  city:varchar({length:20}),
  cp:varchar({length:20}),
  country:varchar({length:15}),
  state:varchar({length:20}),
  street:varchar({length:40})
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const orders = pgTable('orders', {
  id,
  time_stamp: timestamp().defaultNow().notNull(),
  userId: uuid('user_id'),
  ordersDetailsId: uuid('orders_detail_id'),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  ordersDetails: many(ordersDetails),
}));

export const ordersDetails = pgTable('orders_details', {
  id,
  productId: uuid('product_id'),
  quantity: integer().notNull(),
  price: integer().notNull(),
  orderId: uuid('orders_id'),
});

export const ordersDetailsRelations = relations(ordersDetails, ({ one }) => ({
  orders: one(orders, {
    fields: [ordersDetails.orderId],
    references: [orders.id],
  }),
  products: one(products, {
    fields: [ordersDetails.productId],
    references: [products.id],
  }),
}));

export const products = pgTable('products', {
  id,
  price: integer().notNull(),
  description: varchar({ length: 50 }),
  type: productTypeEnum().notNull(),
});

export const productsRelations = relations(products, ({ many, one }) => ({
  ordersDetails: many(orders),
  phisicalProduct: one(phisicalProduct),
  digitalProduct: one(digitalProduct),
  images: many(images)
}));

export const phisicalProduct = pgTable('phisical_product', {
  id,
  weight: integer().notNull(),
  categoryId: uuid('category_id'),
  productId: uuid('product_id'),
});

export const phisicalProductRelations = relations(
  phisicalProduct,
  ({ one }) => ({
    product: one(products, {
      fields: [phisicalProduct.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [phisicalProduct.productId],
      references: [categories.id],
    }),
  }),
);

export const categories = pgTable('categories', {
  id,
  name: varchar({ length: 15 }).notNull(),
  fatherId: uuid('father_id'),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  father: one(categories, {
    fields: [categories.fatherId],
    references: [categories.id],
  }),
  child: many(categories),
  product: many(products),
}));

export const digitalProduct = pgTable('digital_product', {
  id,
  cdKey: varchar({ length: 20 }).notNull(),
  genderId: uuid('gender_id'),
  productId: uuid('product_id'),
});

export const digitalProductRelations = relations(digitalProduct, ({ one }) => ({
  product: one(products, {
    fields: [digitalProduct.productId],
    references: [products.id],
  }),
  gender: one(genders, {
    fields: [digitalProduct.genderId],
    references: [genders.id],
  }),
}));

export const genders = pgTable('genders', {
  id,
  name: varchar({ length: 15 }).notNull(),
});

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(phisicalProduct),
}));

export const images = pgTable('images', {
  assetId:varchar().primaryKey(),
  url: varchar().notNull(),
  productId:uuid('product_id').notNull()
})

export const imagesRelations = relations(images, ({one}) => ({
  product: one(products,{fields:[images.productId], references:[products.id]})
}))