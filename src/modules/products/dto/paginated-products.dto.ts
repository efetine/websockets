import z from 'zod';

import { paginatedResultSchema } from '../../../schemas/paginated-result.dto';
import { productWithCategorySchema } from '../../../../db/schemas/products.schema';

export const paginatedProductsDto = paginatedResultSchema(
  productWithCategorySchema,
);

export type PaginatedProductsDto = z.infer<typeof paginatedProductsDto>;
