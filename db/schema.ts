import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

const roleEnum = pgEnum('roleEnum', ['CUSTOMER', 'ADMIN', 'PROVIDER', 'OWNER']);

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  fullname: varchar({ length: 25 }).notNull(),
  role: roleEnum(),
  phone: integer().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  credentials: one(credentials),
}));

export const credentials = pgTable('credentials', {
  id: uuid().defaultRandom().primaryKey(),
  password: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  userId: uuid('user_id').references(() => users.id),
});

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, { fields: [credentials.userId], references: [users.id] }),
}));
