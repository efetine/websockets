import { BadRequestException, Injectable } from '@nestjs/common';
import { mpClient } from '../../config/mercadopago.config';
import { Payment, Preference, MerchantOrder } from 'mercadopago';
import { HOST } from '../../config/enviroments.config';
import { db } from '../../config/db';
import { eq, inArray } from 'drizzle-orm';
import { products } from '../../../db/schemas/schema';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class MercadopagoService {
  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}
  async create(body: CreateMercadopagoDto) {
    try {
      const user = await this.usersService.findOneBy(body.user);

      if (!user || !user.id) {
        throw new BadRequestException('User not found');
      }
      const productsArr = await this.productsService.findManyByIds(body.products.map(({id}) => id))
      
      const productsForPreference = productsArr.map((product) => {
        const prodReq = body.products.find(({ id }) => id === product.id);
        if (!prodReq) {
          throw new BadRequestException(
            `Product by id equal ${product.id} not found`,
          );
        }
        if (!prodReq.quantity) {
          throw new BadRequestException(
            `Quantity of product by id equal ${product.id} is required`,
          );
        }
        if (!product) {
          throw new BadRequestException(
            `Product by id equal ${prodReq.id} not found`,
          );
        }
        if (product.stock < prodReq.quantity) {
          throw new BadRequestException(
            `Product by id equal ${product.id} out of stock`,
          );
        }
        return {
          id: product.id,
          title: product.name,
          quantity: prodReq.quantity,
          unit_price: product.price,
          currency_id: 'ARS',
          category_id: product.categoryId,
        };
      });
      const productForOrder = productsArr.map((product) => {
        const prodReq = body.products.find(
          ({ id }) => id === product.id,
        ) as any;
        return {
          productId: product.id,
          quantity: prodReq.quantity,
          price: product.price,
        };
      });

      const orderId = await this.ordersService.create({
        userId: user.id,
        products: productForOrder,
      });

      const orderBody = {
        body: {
          items: productsForPreference,
          payer: {
            email: user.email,
            id: user.id,
          },
          notification_url: `${HOST}/mercadopago/webhook`,
          metadata: {
            userId: user.id,
            email: user.email,
            orderId,
          },
        },
      };

      const preference = await new Preference(mpClient).create(orderBody);
      return preference;
    } catch (error) {
      console.log(error);
    }
  }

  async webhook(body: any) {
    if (body.data) {
      const payment: any = await new Payment(mpClient).get(body.data);
      if (payment.order.id) {
        const metadata = payment.metadata;
        const products = payment.additional_info.items;
        console.log(products);
      }
    }
  }
}
