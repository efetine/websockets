import z from 'zod';

export const paginationDto = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(5).max(20).default(5),
});

export const paginationCursorNumberDto = z.object({
  cursor: z.coerce.number().min(0).optional().nullable(),
  limit: z.coerce.number().min(5).max(20).default(5),
});

export const paginationByUserDto = z.object({
  cursor: z.coerce.number().min(0).optional().nullable(),
  limit: z.coerce.number().min(5).max(20).default(5),
  userId: z.string().uuid(),
});

export type PaginationDto = z.infer<typeof paginationDto>;

export type PaginationByUserDto = z.infer<typeof paginationByUserDto>;

export type PaginationCursorNumberDto = z.infer<typeof paginationCursorNumberDto>;
