import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createMercadopagoDto: any) {
    return await this.mercadopagoService
      .create(createMercadopagoDto)
      .then((res) => res)
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    await this.mercadopagoService.webhook(body);
  }
}
