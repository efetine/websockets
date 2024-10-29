import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CouponRepository } from './coupon.repository';
import { CreateCouponDto } from '../../../db/schemas/coupon.schema';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async findAllCoupons() {
    return await this.couponRepository.findAllCoupons();
  }

  async createCoupon(couponData: CreateCouponDto) {
    return await this.couponRepository.createDiscountCoupon(couponData);
  }

  async validateCoupon(couponCode: string) {
    return await this.couponRepository.validateCouponExpired(couponCode);
  }

  async applyCouponToOrder(
    orderAmount: number,
    couponCode: string,
  ): Promise<{ adjustedTotal: number; coupon: CreateCouponDto }> {
    const coupon = await this.couponRepository.findOneByCode(couponCode);

    if (!coupon.isActive || new Date(coupon.expirationDate) < new Date()) {
      throw new BadRequestException('Coupon is expired or not valid');
    }

    const discountAmount = (orderAmount * coupon.discountPercentage) / 100;
    const adjustedTotal = orderAmount - discountAmount;

    return { adjustedTotal, coupon };
  }

  async findOneBy(couponCode: string) {
    return await this.couponRepository.findOneByCode(couponCode);
  }

  async deleteCoupon(couponCode: string) {
    return await this.couponRepository.deleteDiscountCoupon(couponCode);
  }

  async updateDiscountPercentage(
    couponCode: string,
    newDiscountPercentage: number,
  ) {
    return await this.couponRepository.updateDiscountPercentage(
      couponCode,
      newDiscountPercentage,
    );
  }

  async cancelCouponByCode(couponCode: string): Promise<{ message: string }> {
    return await this.couponRepository.cancelCouponByCode(couponCode);
  }
}
