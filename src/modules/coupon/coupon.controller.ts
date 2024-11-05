import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendCouponsDto, sendCouponsSchema } from './dto/send-coupons-dto';
import type { PaginatedCouponsDto } from './dto/paginated-coupons-dto';
import { getCouponsSchema } from './dto/get-coupons-dto';
import {
  UpdateCouponStatusDto,
  updateCouponStatusSchema,
} from './dto/update-coupon-status-dto';

@Controller('coupons')
@ApiTags('Coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all coupons',
    content: {
      'application/json': {
        example: [
          {
            id: '1234-5678-abcd-efgh',
            couponCode: 'SAVE20',
            discountPercentage: 20,
            expirationDate: '2024-12-31',
            isActive: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupons not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupons not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async getAllCoupons(
    @Query('cursor') cursor: string,
    @Query('limit') limit: number,
  ): Promise<PaginatedCouponsDto> {
    const input = getCouponsSchema.safeParse({ cursor, limit });

    if (!input.success) {
      throw new BadRequestException(input.error.errors);
    }

    return this.couponService.findAllCoupons(input.data);
  }

  @Post()
  async sendCoupons(@Body() sendCouponsDto: SendCouponsDto) {
    const input = sendCouponsSchema.safeParse(sendCouponsDto);

    if (!input.success) {
      throw new BadRequestException(input.error.errors);
    }

    return this.couponService.sendCoupons(input.data);
  }

  @Get('validate/:id')
  @ApiOperation({ summary: 'Validate a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon validated successfully',
    content: {
      'application/json': {
        example: 'Coupon Expired',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async validate(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.validateCoupon(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon retrieved successfully',
    content: {
      'application/json': {
        example: {
          id: '1234-5678-abcd-efgh',
          couponCode: 'SAVE10',
          discountPercentage: 10,
          expirationDate: '2024-11-30',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) couponCode: string) {
    return this.couponService.findOneBy(couponCode);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon deleted successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.deleteCoupon(id);
  }

  @Patch('update-discount/:id')
  @ApiOperation({ summary: 'Update discount percentage of a coupon' })
  @ApiBody({
    description: 'Request body to update the discount percentage',
    required: true,
    examples: {
      example1: {
        summary: 'Update Discount Example',
        value: {
          discountPercentage: 15,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Discount percentage updated successfully',
    content: {
      'application/json': {
        example: {
          message: 'Discount percentage updated successfully',
          newDiscountPercentage: 15,
        },
      },
    },
  })
  async updateDiscount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('discountPercentage') discountPercentage: number,
  ) {
    return this.couponService.updateDiscountPercentage(id, discountPercentage);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Toggle coupon status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon status changed successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon status changed successfully',
        },
      },
    },
  })
  async changeCouponStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCouponStatusDto,
  ) {
    const validation = updateCouponStatusSchema.safeParse(body);

    if (!validation.success) {
      throw new BadRequestException(validation.error.errors);
    }

    return this.couponService.changeStatus(id, validation.data.isActive);
  }

  @Get('code/:couponCode')
  @ApiOperation({ summary: 'Get a coupon by coupon code' })
  @ApiResponse({
    status: 200,
    description: 'Coupon retrieved successfully',
    content: {
      'application/json': {
        example: {
          id: '1234-5678-abcd-efgh',
          couponCode: 'SAVE20',
          discountPercentage: 20,
          expirationDate: '2024-12-31',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findOneByCode(@Param('couponCode') couponCode: string) {
    return this.couponService.findOneByCode(couponCode);
  }

  @Patch('toggle-status/:id')
  @ApiOperation({ summary: 'Toggle coupon status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon status toggled successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon has been activated',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.toggleStatus(id);
  }
}
