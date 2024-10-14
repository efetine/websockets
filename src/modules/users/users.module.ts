import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { drizzleAsyncProvider } from '../../../db/drizzle.provider';
import { AppModule } from '../../app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
