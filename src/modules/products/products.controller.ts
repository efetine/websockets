import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { InsertProduct, productInsertSchema } from '../../../db/schema';
import { LimitPipe } from './pipes/limitPage.pipe';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('createproduct')
  @ApiOperation({ summary: 'Create Product' })
  async create(@Body() body: InsertProduct) {
    const validation = productInsertSchema.safeParse(body);
    if (!validation.success) {
      throw new BadRequestException(validation.error.issues);
    }
    return await this.productsService.create(validation.data as InsertProduct);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Paginated Products (Page/Limit)' })
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', LimitPipe) limit: number,
  ) {
    if (page < 1) [];
    return await this.productsService.findAll({ page, limit });
  }

  @Get('category')
  @ApiOperation({ summary: 'Get All Products By Category' })
  async findByCategory(
    @Query('category') category: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', LimitPipe) limit: number,
  ) {
    return await this.productsService.findByCategory({ category, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Product by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Product by ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Partial<InsertProduct>,
  ) {
    return await this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Product by ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.remove(id);
  }
}
