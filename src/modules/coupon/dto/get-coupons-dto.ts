import z from 'zod';

import { paginationDto } from '../../../schemas/pagination.dto';

export const getCouponsSchema = paginationDto;

export type GetCouponsDto = z.infer<typeof getCouponsSchema>;
