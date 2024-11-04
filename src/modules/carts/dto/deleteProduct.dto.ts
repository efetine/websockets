import { z } from "zod"

export const removeProductFromCartDto = z.object({
  productId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type RemoveProductFromCartDto = z.infer<typeof removeProductFromCartDto>;