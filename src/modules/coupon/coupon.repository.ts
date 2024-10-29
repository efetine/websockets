import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { coupons, CreateCouponDto } from '../../../db/schemas/coupon.schema';
import { db } from '../../config/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class CouponRepository {
  async findAllCoupons(): Promise<CreateCouponDto[]> {
    const couponsList = await db.select().from(coupons).execute();
    return couponsList;
  }
  async createDiscountCoupon(
    couponData: CreateCouponDto,
  ): Promise<CreateCouponDto[]> {
    try {
      console.log(couponData);
      const coupon = await db
        .insert(coupons)
        .values(couponData)
        .returning()
        .execute();

      if (!coupon) {
        throw new BadRequestException('Error creating coupon');
      }
      return coupon;
    } catch (error: any) {
      throw new BadRequestException('Error creating coupon: ' + error.message);
    }
  }

  async validateCouponExpired(couponCode: string): Promise<boolean> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .execute();

    if (!coupon || !coupon.isActive) {
      return false;
    }

    const isExpired = new Date() > new Date(coupon.expirationDate);
    return !isExpired;
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

  async deleteDiscountCoupon(couponCode: string): Promise<{ message: string }> {
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .limit(1)
      .execute();

    if (!coupon.length) {
      throw new NotFoundException('Coupon not found');
    }

    await db
      .delete(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .execute();

    return { message: 'Coupon successfully deleted' };
  }

  async updateDiscountPercentage(
    couponCode: string,
    newDiscountPercentage: number,
  ): Promise<CreateCouponDto> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .execute();

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = await db
      .update(coupons)
      .set({ discountPercentage: newDiscountPercentage })
      .where(eq(coupons.couponCode, couponCode))
      .returning()
      .execute();

    return updatedCoupon[0];
  }

  async cancelCouponByCode(couponCode: string): Promise<{ message: string }> {
    try {
      const result = await db
        .update(coupons)
        .set({ isActive: false })
        .where(eq(coupons.couponCode, couponCode))
        .execute();

      if (coupons.isActive === coupons.isActive)
        throw new BadRequestException('Coupon is already Deactivated');
      return { message: 'Coupon has been deactivated' };
    } catch (error: any) {
      throw new Error('Error canceling the coupon: ' + error.message);
    }
  }
}
