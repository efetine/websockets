import z from 'zod';
import { insertCouponSchema } from '../../../../db/schemas/coupon.schema';

export const sendCouponsSchema = z.object({
  emails: z.array(z.string().email()),
  coupon: insertCouponSchema.pick({
    discountPercentage: true,
    expirationDate: true,
  }),
});

export type SendCouponsDto = z.infer<typeof sendCouponsSchema>;
