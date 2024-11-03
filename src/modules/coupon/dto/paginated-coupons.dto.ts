import z from 'zod';

import { paginatedResultSchema } from '../../../schemas/paginated-result.dto';
import { selectCouponSchema } from '../../../../db/schemas/coupon.schema';

export const paginatedCouponsDto = paginatedResultSchema(selectCouponSchema);

export type PaginatedCouponsDto = z.infer<typeof paginatedCouponsDto>;
