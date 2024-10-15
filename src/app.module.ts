import { Module } from '@nestjs/common';
import { drizzleProvider } from '../db/drizzle.provider';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [UsersModule, ProductsModule],
  providers: [...drizzleProvider],
  exports: [...drizzleProvider],
})
export class AppModule {}
