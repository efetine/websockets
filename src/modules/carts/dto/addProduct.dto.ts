import {z} from 'zod'

export const addProductToCartDto = z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1).default(1),
    userId: z.string().uuid()
})

export type AddProductToCartDto = z.infer<typeof addProductToCartDto>