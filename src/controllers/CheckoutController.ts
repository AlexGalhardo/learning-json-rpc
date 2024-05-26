import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
import { CheckoutLog, Product } from "src/config/mongoose";

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
            const product = await Product.findOneAndUpdate(
                {
                    product_id: Bun.env.DEFAULT_PRODUCT_ID,
                    stock: { $gt: 0 },
                },
                {
                    $inc: { stock: -1 },
                },
            );

            if (!product) throw new Error("Product not found or out of stock");

            await CheckoutLog.create([
                {
                    user_id: randomUUID(),
                    user_email: faker.internet.email(),
                    product_id: Bun.env.DEFAULT_PRODUCT_ID,
                    product_sku: randomUUID(),
                    created_at: new Date(),
                },
            ]);

            return {
                success: true,
                product,
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
