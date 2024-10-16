import { createInsertSchema } from 'drizzle-zod';
import { db } from './db';
import { products, categories, users, InsertProduct } from './schema';
import { faker } from '@faker-js/faker';

const main = async () => {
  const categoriesData: (typeof categories.$inferInsert)[] = [];

  const productsData: (typeof products.$inferInsert)[] = [];

  const usersData: (typeof users.$inferInsert)[] = [];

  for (let i = 0; i < 10; i++) {
    categoriesData.push({
      name: faker.commerce.department().toLowerCase(),
    });
  }

  const resultCategories = await db
    .insert(categories)
    .values(categoriesData)
    .returning({ id: users.id });

  for (let i = 0; i < 50; i++) {
    productsData.push({
      name: `${faker.word.adjective().toLowerCase()} ${faker.word.noun().toLowerCase()}`,
      price: faker.number.int({ min: 10, max: 1000 }),
      description: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(['DIGITAL', 'PHISICAL']),
      stock: faker.number.int({ min: 1, max: 100 }),
      categoryId: faker.helpers.arrayElement(resultCategories).id,
    });
  }

  for (let i = 0; i < 15; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
    });
  }

  await db.insert(products).values(productsData);

  await db.insert(users).values(usersData);

  await db.$client.end();
};

main();
