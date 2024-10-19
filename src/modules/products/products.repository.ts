import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../../config/db';
import { InsertProduct, products } from '../../../db/schemas/schema';
import { eq, and, gt } from 'drizzle-orm';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly filesService: FilesService) {}

  async findAllProducts({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<
    Omit<InsertProduct, 'description' | 'categoryId' | 'stock'>[] | []
  > {
    const products = await db.query.products
      .findMany({
        with: { category: { columns: { name: true } } },
        where: (products, { gt, eq, and }: any) =>
          and(gt(products.stock, 1), eq(products.active, true)),
        columns: { categoryId: false, description: false, stock: false },
        limit: limit,
        offset: (page - 1) * limit,
      })
      .catch((err) => {
        throw new BadRequestException('There are no more products available');
      });
    if (products.length === 0) return [];
    return products;
  }

  async findProductsByCategory({
    category,
    page,
    limit,
  }: {
    category: string;
    page: number;
    limit: number;
  }): Promise<Omit<InsertProduct, 'description' | 'categoryId' | 'stock'>[]> {
    const productsArr = await db.query.products
      .findMany({
        with: { category: { columns: { name: true } } },
        where: and(
          gt(products.stock, 1),
          eq(products.active, true),
          eq(products.categoryId, category),
        ),
        columns: { categoryId: false, description: false, stock: false },
        limit: limit,
        offset: (page - 1) * limit,
      })
      .catch((err) => {
        throw new BadRequestException(
          'There are no products available for this category',
        );
      });
    if (productsArr.length === 0) {
      throw new NotFoundException('Products Not Found for this category');
    }
    return productsArr;
  }

  async createProduct(productData: InsertProduct): Promise<InsertProduct[]> {
    const product = await db.insert(products).values(productData).returning();
    if (!product) throw new BadRequestException('Error creando el producto');
    return product;
  }

  async findOneById(id: string): Promise<InsertProduct> {
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, id),
        eq(products.active, true),
        gt(products.stock, 1),
      ),
      with: { category: true },
    });
    if (!product) throw new NotFoundException('Product not Found');
    return product;
  }

  async updateProduct(
    id: string,
    productData: Partial<InsertProduct>,
  ): Promise<Partial<InsertProduct>[]> {
    const updateProduct = await db
      .update(products)
      .set(productData)
      .where(and(eq(products.id, id), eq(products.active, true)))
      .returning({
        id: products.id,
        price: products.price,
        description: products.description,
        type: products.type,
        stock: products.stock,
        name: products.name,
        categoryId: products.categoryId,
      });
    if (updateProduct.length == 0)
      throw new NotFoundException('Product ID Not Found');
    return updateProduct;
  }

  async removeProduct(id: string): Promise<{ message: string }> {
    const rowCount = (
      await db
        .update(products)
        .set({ active: false })
        .where(and(eq(products.active, true), eq(products.id, id)))
    ).rowCount;
    if (rowCount == 0) throw new NotFoundException('Product not Found');
    return { message: 'Product deleted Successfuly' };
  }

  async updateProductImage(productId: string, file: Express.Multer.File) {
    const resultFile = await this.filesService.uploadImage(file);

    const resultProduct = await db
      .update(products)
      .set({ imageUrl: resultFile.secure_url })
      .where(eq(products.id, productId))
      .returning();

    if (resultProduct.length === 0)
      throw new NotFoundException(`User with ${productId} uuid not found.`);

    return resultFile;
  }

  async removeProductImage(productId: string, publicId: string) {
    await this.filesService.removeSingleImage(publicId);

    const result = await db
      .update(products)
      .set({
        imageUrl:
          'https://res.cloudinary.com/dnfslkgiv/image/upload/v1726516516/muft4cnobocgkvbgj215.png',
      })
      .where(eq(products.id, productId))
      .returning();

    if (result.length === 0)
      throw new NotFoundException(
        `Product with ${productId} uuid didn't exist.`,
      );

    return { message: 'Product image modified successfuly.' };
  }
}
