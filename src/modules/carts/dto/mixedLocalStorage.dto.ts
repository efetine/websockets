import { userInfo } from 'os';
import { z } from 'zod';

export const mixedLocalStorageDto = z.object({
  products: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().min(1),
    }),
  ),
  userId: z.string().uuid(),
});

export type MixedLocalStorageDto = z.infer<typeof mixedLocalStorageDto>;
