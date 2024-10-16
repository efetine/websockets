import { db } from './db';
import { products } from './schema';

const main = async () => {
  await db.insert(products).values([
    {
      name: 'Patito',
      price: 100,
      stock: 2,
      type: 'DIGITAL',
    },
    {
      name: 'Pato',
      price: 200,
      stock: 5,
      type: 'DIGITAL',
    },
  ]);

  await db.$client.end();
};

main();
