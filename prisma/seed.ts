import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient({
	errorFormat: "pretty",
});

const seedDatabase = async () => {
	await prisma.users.deleteMany({});
	await prisma.products.deleteMany({});

	await prisma.products.createMany({
		data: [
			{
				id: process.env.PRODUCT_ID,
				name: "TEST Product",
				stock: Number(process.env.PRODUCT_TOTAL_STOCK),
			},
		],
	});
};

seedDatabase();
