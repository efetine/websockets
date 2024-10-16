import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { InsertProduct, productInsertSchema } from '../../db/schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() body: InsertProduct) {
    const validation = productInsertSchema.safeParse(body);
    if (!validation.success) {
      throw new BadRequestException(validation.error);
    }
    return await this.productsService.create(validation.data);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<InsertProduct>) {
    return await this.productsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
