import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { InsertCouponSchema } from '../../../db/schemas/coupon.schema';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('all')
  async getAllCoupons() {
    return this.couponService.findAllCoupons();
  }

  @Post()
  async create(@Body() couponData: InsertCouponSchema) {
    return this.couponService.createCoupon(couponData);
  }

  @Get('validate/:code')
  async validate(@Param('code') couponCode: string) {
    return this.couponService.validateCoupon(couponCode);
  }

  @Get(':code')
  async findOne(@Param('code') couponCode: string) {
    return this.couponService.findOneBy(couponCode);
  }

  @Delete(':code')
  async delete(@Param('code') couponCode: string) {
    return this.couponService.deleteCoupon(couponCode);
  }

  @Patch('update-discount/:code')
  async updateDiscount(
    @Param('code') couponCode: string,
    @Body('discountPercentage') discountPercentage: number,
  ) {
    return this.couponService.updateDiscountPercentage(
      couponCode,
      discountPercentage,
    );
  }

  @Patch('cancel/:code')
  async cancelCouponByCode(@Param('code') couponCode: string) {
    return this.couponService.cancelCouponByCode(couponCode);
  }
}
