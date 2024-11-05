import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  coupons,
  type CreateCouponDto,
} from '../../../db/schemas/coupon.schema';
import { db } from '../../config/db';
import { eq, gte } from 'drizzle-orm';
import type { GenerateCouponsDto } from './dto/generate-coupons-dto';
import type { GetCouponsDto } from './dto/get-coupons-dto';
import type { PaginatedCouponsDto } from './dto/paginated-coupons-dto';

@Injectable()
export class CouponRepository {
  async findAllCoupons({
    cursor,
    limit,
  }: GetCouponsDto): Promise<PaginatedCouponsDto> {
    try {
      const limitWithExtra = limit + 1;

      const selectedCategories = await db
        .select()
        .from(coupons)
        .where(cursor ? gte(coupons.id, cursor) : undefined)
        .limit(limitWithExtra)
        .orderBy(coupons.id);

      let nextCursor: string | null = null;

      if (selectedCategories.length === limitWithExtra) {
        nextCursor = selectedCategories[selectedCategories.length - 1].id;
        selectedCategories.pop();
      }

      return { data: selectedCategories, nextCursor };
    } catch {
      throw new InternalServerErrorException('Error fetching Categories');
    }
  }

  async validateCouponExpired(id: string): Promise<{ message: string }> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();
    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }
    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is inactive');
    }
    const isExpired = new Date() > new Date(coupon.expirationDate);
    if (isExpired) {
      throw new BadRequestException('Coupon is expired');
    }
    return { message: 'Validation successful' };
  }

  async findOneById(id: string): Promise<CreateCouponDto> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async deleteDiscountCoupon(id: string): Promise<{ message: string }> {
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .limit(1)
      .execute();

    if (!coupon.length) {
      throw new NotFoundException('Coupon not found');
    }

    await db.delete(coupons).where(eq(coupons.id, id)).execute();

    return { message: 'Coupon successfully deleted' };
  }

  async updateDiscountPercentage(
    id: string,
    newDiscountPercentage: number,
  ): Promise<CreateCouponDto> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = await db
      .update(coupons)
      .set({ discountPercentage: newDiscountPercentage })
      .where(eq(coupons.id, id))
      .returning()
      .execute();

    return updatedCoupon[0];
  }

  async changeCouponStatusById(
    id: string,
    isActive: boolean,
  ): Promise<{ message: string }> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }
    await db
      .update(coupons)
      .set({ isActive })
      .where(eq(coupons.id, id))
      .execute();

    const statusMessage = isActive ? 'activated' : 'deactivated';
    return { message: `Coupon has been ${statusMessage}` };
  }
  async findOneByCode(couponCode: string): Promise<CreateCouponDto> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .execute();

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }
  async changeActive(id: string): Promise<{ message: string }> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }

    const newStatus = !coupon.isActive;
    await db
      .update(coupons)
      .set({ isActive: newStatus })
      .where(eq(coupons.id, id))
      .execute();

    const statusMessage = newStatus ? 'activated' : 'deactivated';
    return { message: `Coupon has been ${statusMessage}` };
  }

  async generateCoupons(input: GenerateCouponsDto): Promise<CreateCouponDto[]> {
    const newCoupons = Array.from({ length: input.quantity }).map(() => ({
      couponCode: Math.random().toString(36).substring(2, 15),
      discountPercentage: input.discountPercentage,
      expirationDate: input.expirationDate,
    }));

    const couponsList = await db.insert(coupons).values(newCoupons).returning();

    return couponsList;
  }
}
