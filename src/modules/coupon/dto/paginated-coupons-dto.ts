import z from 'zod';

import { selectCouponSchema } from '../../../../db/schemas/coupon.schema';
import { paginatedResultSchema } from '../../../schemas/paginated-result.dto';

export const paginatedCouponsDto = paginatedResultSchema(selectCouponSchema);

export type PaginatedCouponsDto = z.infer<typeof paginatedCouponsDto>;
