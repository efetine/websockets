import { BadGatewayException, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { db } from "../../config/db";
import { orders, ordersDetails } from "../../../db/schemas/orders.schema";

@Injectable()
export class ordersRepository {
    async create(data: CreateOrderDto){
        const order = await db.insert(orders).values({userId:data.userId, mpOrderId:data.mpOrderID}).execute({id:true}) as any

        if(!order || !order.id){
            throw new BadGatewayException("Error creating order")
        }

        const ordersDetailsObj = data.products.map((product) => {
            return {
                orderId: order.id,
                productId: product.productId,
                quantity: product.quantity
            }
        })

        const orderDetails = await db.insert(ordersDetails).values(ordersDetailsObj).execute()   

        if(!orderDetails){
            throw new BadGatewayException("Error creating order details")
        }
    }
}