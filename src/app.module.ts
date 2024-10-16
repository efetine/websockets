import { Module } from '@nestjs/common';
import { drizzleProvider } from '../db/drizzle.provider';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule],
  providers: [...drizzleProvider],
  exports: [...drizzleProvider],
})
export class AppModule {}
