import z from 'zod';

export const updateCouponStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateCouponStatusDto = z.infer<typeof updateCouponStatusSchema>;
