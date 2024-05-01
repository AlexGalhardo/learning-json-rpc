import { randomUUID } from "node:crypto";
import { prisma } from "../config/prisma";
import { faker } from '@faker-js/faker'

export interface CheckoutControllerResponse {
    success: boolean;
    product?: any;
    message?: string;
}
interface CheckoutPayload {
    product_id: string;
}

export default class CheckoutController {
    static async checkout(checkoutPayload: CheckoutPayload): Promise<CheckoutControllerResponse> {
        try {
            const { product_id } = checkoutPayload;

            const productExists = await prisma.products.findUnique({ where: { id: product_id } });

            if (!productExists) return { success: false, message: "Product not exists" };

			let product = null
            await prisma.$transaction(async (trx) => {
                product = await trx.products.update({
                    where: {
                        id: product_id,
                        stock: {
                            gt: 0,
                        },
                    },
                    data: {
                        stock: {
                            decrement: 1,
                        },
                    },
                });

				await trx.checkoutLogs.create({
					data: {
						user_id: randomUUID(),
						user_email: faker.internet.email(),
						product_id: process.env.PRODUCT_ID,
						product_sku: randomUUID()
					}
				})
            });
			return {
				success: true,
				product,
			};
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
