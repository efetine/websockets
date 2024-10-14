import { Module } from '@nestjs/common';
import { drizzleProvider } from '../db/drizzle.provider';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [...drizzleProvider],
  exports: [...drizzleProvider],
})
export class AppModule {}
