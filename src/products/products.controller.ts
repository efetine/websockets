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

  @Post('/create')
  createProduct(@Body() body: InsertProduct) {
    const validation = productInsertSchema.safeParse(body);
    if (validation.success) {
      return this.productsService.create(validation.data);
    } else {
      throw new BadRequestException(validation.error);
    }
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.productsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
