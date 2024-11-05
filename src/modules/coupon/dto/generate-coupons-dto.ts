import z from 'zod';
import { insertCouponSchema } from '../../../../db/schemas/coupon.schema';

export const generateCouponsSchema = z.object({
  quantity: z.number().int(),
  discountPercentage: insertCouponSchema.shape.discountPercentage,
  expirationDate: insertCouponSchema.shape.expirationDate,
});

export type GenerateCouponsDto = z.infer<typeof generateCouponsSchema>;
