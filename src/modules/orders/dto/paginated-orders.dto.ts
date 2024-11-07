import z from 'zod';

import { paginatedResultSchema } from '../../../schemas/paginated-result.dto';
import { selectOrderSchema } from '../../../../db/schemas/orders.schema';

export const paginatedOrdersDto = paginatedResultSchema(selectOrderSchema);

export type PaginatedOrdersDto = z.infer<typeof paginatedOrdersDto>;
