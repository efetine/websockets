import { Injectable } from '@nestjs/common';
import { CouponRepository } from './coupon.repository';
import { CreateCouponDto } from '../../../db/schemas/coupon.schema';
import type { GetCouponsDto } from './dto/get-coupons.dto';
import { PaginatedCouponsDto } from './dto/paginated-coupons.dto';
import { SendCouponsDto } from './dto/send-coupons-dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly mailService: MailService,
  ) {}

  async findAllCoupons(input: GetCouponsDto) {
    return await this.couponRepository.findAllCoupons(input);
  }

  async validateCoupon(id: string) {
    return await this.couponRepository.validateCouponExpired(id);
  }

  async findOneBy(id: string) {
    return await this.couponRepository.findOneById(id);
  }

  async deleteCoupon(id: string) {
    return await this.couponRepository.deleteDiscountCoupon(id);
  }

  async updateDiscountPercentage(id: string, newDiscountPercentage: number) {
    return await this.couponRepository.updateDiscountPercentage(
      id,
      newDiscountPercentage,
    );
  }

  async changeStatus(
    id: string,
    isActive: boolean,
  ): Promise<{ message: string }> {
    return await this.couponRepository.changeCouponStatusById(id, isActive);
  }
  async findOneByCode(couponCode: string) {
    return await this.couponRepository.findOneByCode(couponCode);
  }
  async toggleStatus(id: string): Promise<{ message: string }> {
    const coupon = await this.couponRepository.findOneById(id);
    const newStatus = !coupon.isActive;
    return this.couponRepository.changeActive(id);
  }

  async sendCoupons(input: SendCouponsDto) {
    const coupons = await this.couponRepository.generateCoupons({
      quantity: input.emails.length,
      discountPercentage: input.coupon.discountPercentage,
      expirationDate: input.coupon.expirationDate,
    });

    for await (const email of input.emails) {
      const coupon = coupons.pop();

      if (coupon !== undefined) {
        await this.mailService.sendCouponMail(
          {
            email,
          },
          coupon,
        );
      }
    }
  }
}
