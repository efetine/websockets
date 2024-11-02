import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { db } from '../../config/db';
import {
  orders,
  ordersDetails,
  selectOrders,
} from '../../../db/schemas/orders.schema';
import { and, asc, eq, gte } from 'drizzle-orm';
import {
  PaginationByUserDto,
  PaginationCursorNumberDto,
} from '../../schemas/pagination.dto';

@Injectable()
export class ordersRepository {
  async create(data: CreateOrderDto) {
    const order = (await db
      .insert(orders)
      .values({
        userId: data.userId,
        mpOrderId: data.mpOrderID,
        amount: data.amount,
      })
      .returning()) as any;
    if (!order[0] || !order[0].id)
      throw new BadRequestException('Error creating order');
    const ordersDetailsObj = data.products.map((product) => {
      return {
        orderId: order[0].id,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      };
    });

    const orderDetails = await db
      .insert(ordersDetails)
      .values(ordersDetailsObj)
      .execute();

    if (!orderDetails) {
      throw new BadGatewayException('Error creating order details');
    }

    return order[0].id;
  }

  async updateToPayment(data: any) {
    const dbResponse = await db
      .update(orders)
      .set({
        mpOrderId: data.mpOrder,
        isPaid: data.paid,
        orderEstatus: data.status,
      })
      .where(eq(orders.id, data.order))
      .execute();
    console.log(dbResponse);
    return dbResponse;
  }

  async getOrdersByUser({
    userId,
    limit,
    cursor,
  }: PaginationByUserDto): Promise<{
    data: selectOrders[] | [];
    nextCursor: number | null;
  }> {
    const where = [eq(orders.userId, userId)];

    if (cursor) where.push(gte(orders.id, cursor));

    const NEXT_CURSOR_ITEM = 1;

    const selectedOrders = await db.query.orders
      .findMany({
        where: and(...where),
        limit: limit + NEXT_CURSOR_ITEM,
        orderBy: asc(orders.id),
      })
      .catch((err) => {
        throw new BadRequestException('There are no more orders available');
      });
    let nextCursor: number | null = null;

    if (selectedOrders.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (selectedOrders.length > limit) {
      nextCursor = selectedOrders.pop()!.id;
    }

    return {
      data: selectedOrders,
      nextCursor,
    };
  }

  async getOrderById(orderId: number) {
    const dbResponse = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        ordersDetails: {
          with: {
            product: true,
          },
        },
      },
    });
    return dbResponse;
  }

  async findAllAdmin({ cursor, limit }: PaginationCursorNumberDto): Promise<{
    data: selectOrders[] | [];
    nextCursor: number | null;
  }> {
    let where: any = undefined;

    if (cursor) where = gte(orders.id, cursor);

    const NEXT_CURSOR_ITEM = 1;
    const selectedOrders = await db.query.orders
      .findMany({
        where,
        limit: limit + NEXT_CURSOR_ITEM,
        orderBy: asc(orders.id),
      })
      .catch((err) => {
        throw new BadRequestException('There are no more orders available');
      });

    let nextCursor: number | null = null;

    if (selectedOrders.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (selectedOrders.length > limit) {
      nextCursor = selectedOrders.pop()!.id;
    }

    return {
      data: selectedOrders,
      nextCursor,
    };
  }
}
