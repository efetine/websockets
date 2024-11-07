import { Module } from '@nestjs/common';
import { WebsocketModule } from './modules/websockets/websockets.module';

@Module({
  imports: [WebsocketModule],
})
export class AppModule {}
